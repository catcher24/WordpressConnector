<?php

namespace Catcher24\WordPress_Connector\Libs\API;

use GuzzleHttp\Client;
use League\OAuth2\Client\Provider\AbstractProvider;
use Exception;

class Catcher24Client {

	private static function get_keycloak_config(): array {
		return [
			'authServerUrl' => 'https://auth.dev.catcher24.net',
			'realm'         => '3efa9fb5-41e4-4695-85c1-44d9dc256c0a',
			'clientId'      => 'wordpress-connector',
			'redirectUri'   => rest_url( CATCHER24_ROUTE_PREFIX . '/accounts/callback' ),
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

	public static function generate_login_flow( bool $silent = false ): string {
		$provider = self::get_provider();

		$options = [
			'scope' => 'openid profile email'
		];

		if ( $silent ) {
			$options['prompt'] = 'none';
		}

		$authUrl  = $provider->getAuthorizationUrl( $options );
		$pkce     = $provider->getPkceCode();

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

	public static function request( string $method, string $endpoint, array $body = [] ) {
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
			],
			'timeout' => 15,
		];

		if ( ! empty( $body ) ) {
			$args['headers']['Content-Type'] = 'application/json';
			$args['body']                    = wp_json_encode( $body );
		}

		$response = wp_remote_request( $url, $args );

		if ( is_wp_error( $response ) ) {
			throw new Exception( $response->get_error_message() );
		}

		$status_code = wp_remote_retrieve_response_code( $response );

		// Handle 401 Unauthorized explicitly from the API
		if ( $status_code === 401 ) {
			self::disconnect();
			throw new Exception( 'Session expired. Please re-authenticate.' );
		}

		$response_body = wp_remote_retrieve_body( $response );
		$decoded       = json_decode( $response_body, true );

		return $decoded;
	}

	public static function proxy_request( string $method, string $sub_path, array $query_params = [], array $body = [], bool $include_tenant = false, bool $include_org = false, ?string $target_id = null ) {		$tenant_id = get_option( CATCHER24_SETTING_SELECTED_TENANT );
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

		$url = add_query_arg( array_filter( $query_params ), $endpoint );

		try {
			return self::request( $method, $url, $body );
		} catch ( Exception $e ) {
			return new \WP_REST_Response( array( 'message' => $e->getMessage() ), 500 );
		}
	}

	public static function get_logout_url(): string {
		$config = self::get_keycloak_config();
		$redirect_uri = admin_url( 'admin.php?page=catcher24-wordpress-connector' );

		return add_query_arg( [
			'client_id'                => $config['clientId'],
			'post_logout_redirect_uri' => $redirect_uri,
		], sprintf('%s/realms/%s/protocol/openid-connect/logout', rtrim($config['authServerUrl'], '/'), $config['realm']) );
	}
}
