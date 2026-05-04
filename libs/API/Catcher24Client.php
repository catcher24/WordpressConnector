<?php
namespace Catcher24\WordPress_Connector\Libs\API;

use GuzzleHttp\Client;
use League\OAuth2\Client\Provider\AbstractProvider;
use Exception;

class Catcher24Client {

  private static function get_keycloak_config(): array {
    return [
      'authServerUrl' => rtrim( CATCHER24_AUTH_URL, '/' ),
      'realm'         => '3efa9fb5-41e4-4695-85c1-44d9dc256c0a',
      'clientId'      => 'wordpress-connector',
      'redirectUri'   => rest_url( rtrim( CATCHER24_ROUTE_PREFIX, '/' ) . '/accounts/callback' ),
      'pkceMethod'    => AbstractProvider::PKCE_METHOD_S256,
    ];
  }

	private static function get_provider() {
		$config = self::get_keycloak_config();
		$provider = new KeycloakPKCEProvider( $config );

		$httpClient = new Client([
			'verify' => ABSPATH . WPINC . '/certificates/ca-bundle.crt',
		]);

		$provider->setHttpClient( $httpClient );

		return $provider;
	}

	public static function generate_login_flow( bool $silent = false, ?string $kc_action = null ): string {
		$provider = self::get_provider();

		$options = [
			'scope' => 'openid profile email'
		];

		if ( $silent ) {
			$options['prompt'] = 'none';
		}

		if ( $kc_action ) {
			$options['kc_action'] = $kc_action;
		}

		$authUrl  = $provider->getAuthorizationUrl( $options );
		$pkce     = $provider->getPkceCode();

		set_transient( 'oauth2_state_' . $provider->getState(), $pkce, 15 * MINUTE_IN_SECONDS );

		return $authUrl;
	}

	public static function generate_register_flow(): string {
		$provider = self::get_provider();

		$options = [
			'scope' => 'openid profile email'
		];

		$authUrl  = $provider->getAuthorizationUrl( $options );
		$pkce     = $provider->getPkceCode();

		$authUrl = str_replace( 'openid-connect/auth', 'openid-connect/registrations', $authUrl );

		set_transient( 'oauth2_state_' . $provider->getState(), $pkce, 15 * MINUTE_IN_SECONDS );

		return $authUrl;
	}

	public static function handle_callback( string $code, string $state ): void {
		$saved_pkce = get_transient( 'oauth2_state_' . $state );

		if ( empty( $state ) || ! $saved_pkce ) {
			throw new Exception( 'Invalid state or expired session.' );
		}

		delete_transient( 'oauth2_state_' . $state );

		$provider = self::get_provider();
		$provider->setPkceCode( $saved_pkce );

		$token = $provider->getAccessToken( 'authorization_code', [
			'code' => $code
		] );

		$user      = $provider->getResourceOwner( $token );
		$user_data = $user->toArray();
		$email     = $user_data['email'] ?? null;

		if ( ! $email ) {
			throw new Exception( 'Email not provided by identity provider.' );
		}

    $access_token = $token->getToken();

    $token_parts = explode( '.', $access_token );
    if ( count( $token_parts ) === 3 ) {
      $payload = json_decode( base64_decode( str_replace( ['-', '_'], ['+', '/'], $token_parts[1] ) ), true );
      $tenant_id = $payload['__tenant__'] ?? null;

      if ( $tenant_id ) {
        update_option( CATCHER24_SETTING_SELECTED_TENANT, $tenant_id );
      }
    }

		$account_data = [
			'email'         => $email,
			'first_name'    => $user_data['given_name'] ?? '',
			'last_name'     => $user_data['family_name'] ?? '',
			'access_token'  => $token->getToken(),
			'refresh_token' => $token->getRefreshToken(),
			'expires'       => $token->getExpires(),
		];

		update_option( 'catcher24_saas_connection', $account_data );
	}

	public static function is_connected(): bool {
		$account = get_option( 'catcher24_saas_connection' );
		return ! empty( $account['access_token'] );
	}

	public static function disconnect(): void {
		delete_option( 'catcher24_saas_connection' );
	}

	/**
	 * Tries to get a valid access token.
	 * Returns the token string if valid/refreshed, or null if unauthenticated/expired.
	 */
	public static function get_valid_token(): ?string {
		$account = get_option('catcher24_saas_connection');

		if (empty($account) || empty($account['access_token'])) {
			return null;
		}

		if (time() >= ($account['expires'] - 60)) {
			$provider = self::get_provider();

			try {
				$new_token = $provider->getAccessToken('refresh_token', [
					'refresh_token' => $account['refresh_token']
				]);

				$account['access_token']  = $new_token->getToken();
				$account['refresh_token'] = $new_token->getRefreshToken();
				$account['expires']       = $new_token->getExpires();

				$token_parts = explode( '.', $new_token );
				if ( count( $token_parts ) !== 3 ) {
					return null;
				}

				$payload = json_decode( base64_decode( $token_parts[1] ), true );
				$tenant_id = $payload['__tenant__'] ?? null;

				update_option( CATCHER24_SETTING_SELECTED_TENANT, $tenant_id );

				update_option('catcher24_saas_connection', $account);
			} catch (Exception $e) {
				self::disconnect();
				// Set a flag indicating we should try a silent re-auth once
				set_transient('catcher24_retry_silent_auth', get_current_user_id(), 30);
				return null;
			}
		}

		return $account['access_token'];
	}

	public static function get_user_info(): ?array {
		self::get_valid_token();

		$account = get_option( 'catcher24_saas_connection' );

		if ( empty( $account ) ) {
			return null;
		}

		return array(
			'email'      => $account['email'] ?? '',
			'first_name' => $account['first_name'] ?? '',
			'last_name'  => $account['last_name'] ?? '',
		);
	}

	public static function request( string $method, string $endpoint, array|object $body = [] ) {
		$token = self::get_valid_token();

		if ( ! $token ) {
			throw new Exception( 'Session expired. Please re-authenticate.' );
		}

		$url = str_starts_with( $endpoint, 'http' )
			? $endpoint
			: rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . '/' . ltrim( $endpoint, '/' );

		$args = [
			'method'  => strtoupper( $method ),
			'headers' => [
				'Authorization' => 'Bearer ' . $token,
				'Accept'        => 'application/json',
				'Content-Type'        => 'application/json',
			],
			'timeout' => 15,
		];

		if ( ! empty( $body ) ) {
			$args['body']                    = wp_json_encode( $body );
		}

		$response = wp_remote_request( $url, $args );

		if ( is_wp_error( $response ) ) {
			throw new Exception( esc_html( $response->get_error_message() ) );
		}

		$status_code = wp_remote_retrieve_response_code( $response );

		if ( $status_code === 401 ) {
			self::disconnect();
			throw new Exception( 'Session expired. Please re-authenticate.' );
		}

		$response_body = wp_remote_retrieve_body( $response );

		// 2. Remove 'true' to decode as objects
		$decoded = json_decode( $response_body );

		return $decoded;
	}

	public static function proxy_request( string $method, string $sub_path, array $query_params = [], array|object $body = [], bool $include_tenant = false, bool $include_org = false, ?string $target_id = null ) {
    $tenant_id = get_option( CATCHER24_SETTING_SELECTED_TENANT );
		$organization_id = get_option( CATCHER24_SETTING_SELECTED_ORGANIZATION );

		if ( $include_tenant && ! $tenant_id ) {
			return new \WP_REST_Response( array( 'message' => 'Missing tenant context' ), 400 );
		}

		if ( $include_org && ! $organization_id ) {
			return new \WP_REST_Response( array( 'message' => 'Missing organization context' ), 400 );
		}

		$pathSegments = [];
		if ( $include_tenant ) {
			$pathSegments[] = "tenants/{$tenant_id}";
		}
		if ( $include_org ) {
			$pathSegments[] = "organizations/{$organization_id}";
		}
		if ( $target_id ) {
			$pathSegments[] = "targets/{$target_id}";
		}
		$pathSegments[] = ltrim( $sub_path, '/' );

		$full_path = implode( '/', $pathSegments );
		$endpoint = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) .  "/api/{$full_path}";

		$query_string = http_build_query($query_params);

		$url = $endpoint . (str_contains($endpoint, '?') ? '&' : '?') . $query_string;

		try {
			return self::request( $method, $url, $body );
		} catch ( Exception $e ) {
			return new \WP_REST_Response( array( 'message' => $e->getMessage() ), 500 );
		}
	}

	public static function resolve_proxy_response( $response, $success_status = 200 ) {
		if ( is_wp_error( $response ) || $response instanceof \WP_REST_Response ) {
			return $response;
		}

		$status_code = null;

		if ( is_object( $response ) && isset( $response->status ) ) {
			$status_code = $response->status;
		} elseif ( is_array( $response ) && isset( $response['status'] ) ) {
			$status_code = $response['status'];
		}

		if ( $status_code !== null && is_numeric( $status_code ) && $status_code >= 400 ) {
			return new \WP_REST_Response( $response, (int) $status_code );
		}

		return new \WP_REST_Response( $response, $success_status );
	}

	public static function get_logout_url(): string {
		$config = self::get_keycloak_config();
		$redirect_uri = admin_url( 'admin.php?page=catcher24-connector' );

		return add_query_arg( [
			'client_id'                => $config['clientId'],
			'post_logout_redirect_uri' => $redirect_uri,
		], sprintf('%s/realms/%s/protocol/openid-connect/logout', rtrim($config['authServerUrl'], '/'), $config['realm']) );
	}
}
