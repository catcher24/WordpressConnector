<?php

namespace Catcher24\WordPress_Connector\Libs\API;

use Stevenmaguire\OAuth2\Client\Provider\Keycloak;
use Exception;

class Catcher24Client {private string $base_url = 'https://api.dev.catcher24.net';

	private function get_provider(): Keycloak {
		return new Keycloak([
			'authServerUrl' => 'https://auth.dev.catcher24.net',
			'realm'         => '3efa9fb5-41e4-4695-85c1-44d9dc256c0a',
			'clientId'      => 'wordpress-connector',
		]);
	}

	private function get_valid_token(): string {
		$account = get_option( 'catcher24_saas_connection' );

		if ( empty( $account ) || empty( $account['access_token'] ) ) {
			throw new Exception( 'Not authenticated with SaaS.' );
		}

		if ( time() >= ( $account['expires'] - 60 ) ) {
			$provider = $this->get_provider();

			$new_token = $provider->getAccessToken( 'refresh_token', [
				'refresh_token' => $account['refresh_token']
			] );

			$account['access_token']  = $new_token->getToken();
			$account['refresh_token'] = $new_token->getRefreshToken();
			$account['expires']       = $new_token->getExpires();

			update_option( 'catcher24_saas_connection', $account );
		}

		return $account['access_token'];
	}

	public function request( string $method, string $endpoint, array $body = [] ) {
		$token = $this->get_valid_token();
		$url   = rtrim( $this->base_url, '/' ) . '/' . ltrim( $endpoint, '/' );

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
		$body        = wp_remote_retrieve_body( $response );
		$decoded     = json_decode( $body, true );

		if ( $status_code >= 400 ) {
			throw new Exception( $decoded['message'] ?? 'SaaS API Error' );
		}

		return $decoded;
	}
}
