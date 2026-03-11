<?php

namespace Catcher24\WordPress_Connector\Controllers\Hub;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;
use Exception;

class Actions {

	/**
	 * Proxy the SignalR negotiate request to the API Gateway.
	 * This handles providing the token to the frontend securely,
	 * preventing the full JWT from being hardcoded in localized scripts.
	 */
	public function public_negotiate( \WP_REST_Request $request ) {
		$token = Catcher24Client::get_valid_token();
		
		if ( ! $token ) {
			return new \WP_REST_Response( array( 'message' => 'Session expired. Please re-authenticate.' ), 401 );
		}
		
		$query_params = $request->get_query_params();
		
		try {
			// SignalR endpoints are often at /signalr/publicMessage or similar.
			// The exact endpoint for Catcher24 API gateway is based on the route requested.
			// Let's proxy to the SaaS's own negotiate endpoint for public message hub.
			$endpoint = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . "/signalr/publicMessage/negotiate";
			$url = add_query_arg( array_filter( $query_params ), $endpoint );

			$decoded = Catcher24Client::request( 'POST', $url );

			// Provide the valid access token back to the frontend so it can establish 
			// the actual WebSocket connection directly to the SaaS server.
			$decoded['accessToken'] = $token;
			$decoded['url'] = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . "/signalr/publicMessage";
			
			return new \WP_REST_Response( $decoded, 200 );

		} catch ( Exception $e ) {
			return new \WP_REST_Response( array( 'message' => $e->getMessage() ), 500 );
		}
	}
}
