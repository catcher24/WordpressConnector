<?php

namespace Catcher24\WordPress_Connector\Controllers\Accounts;

use Catcher24\WordPress_Connector\Libs\API\KeycloakPKCEProvider;
use League\OAuth2\Client\Provider\AbstractProvider;
use Exception;
use WP_REST_Request;

class Actions {

	private function get_provider() {
		$provider = new KeycloakPKCEProvider([
			'authServerUrl' => 'https://auth.dev.catcher24.net',
			'realm'         => '3efa9fb5-41e4-4695-85c1-44d9dc256c0a',
			'clientId'      => 'wordpress-connector',
			'redirectUri'   => rest_url( CATCHER24_ROUTE_PREFIX . '/accounts/callback' ),
			'pkceMethod'    => AbstractProvider::PKCE_METHOD_S256,
		]);

		// Force Guzzle to use WordPress's bundled certificates
		$httpClient = new \GuzzleHttp\Client([
			'verify' => ABSPATH . WPINC . '/certificates/ca-bundle.crt',
		]);

		$provider->setHttpClient( $httpClient );

		return $provider;
	}

// ONLY handles sending the user to Keycloak
	public function signin( WP_REST_Request $request ) {
		$provider = $this->get_provider();
		$authUrl = $provider->getAuthorizationUrl([
			'scope' => 'openid profile email'
		]);
		$pkce     = $provider->getPkceCode();

		set_transient( 'oauth2_state_' . $provider->getState(), $pkce, 15 * MINUTE_IN_SECONDS );

		wp_redirect( $authUrl );
		exit;
	}

	// ONLY handles the return trip from Keycloak
	public function callback( WP_REST_Request $request ) {
		$provider = $this->get_provider();
		$code     = $request->get_param( 'code' );
		$state    = $request->get_param( 'state' );

		if ( empty( $code ) ) {
			return Messages::error_auth_failed( 'Authorization code missing. Your server might be stripping query parameters.' );
		}

		$saved_pkce = get_transient( 'oauth2_state_' . $state );

		if ( empty( $state ) || ! $saved_pkce ) {
			return Messages::error_auth_failed( 'Invalid state or expired session.' );
		}

		delete_transient( 'oauth2_state_' . $state );

		try {
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

			// Redirect back to the React Dashboard
			$react_app_url = admin_url( 'admin.php?page=catcher24-wordpress-connecto#/dashboard' );
			wp_redirect( $react_app_url );
			exit;

		} catch ( Exception $e ) {
			return Messages::error_auth_failed( $e->getMessage() );
		}
	}

	public function status() {
		$account = get_option( 'catcher24_saas_connection' );
		$is_connected = ! empty( $account['access_token'] );

		return Messages::connection_status( $is_connected );
	}

	public function disconnect() {
		delete_option( 'catcher24_saas_connection' );
		return Messages::success_signout();
	}
}
