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
			$organization_id = get_option( CATCHER24_SETTING_SELECTED_ORGANIZATION );

			if ( $organization_id ) {
				$query_params['organizationId'] = $organization_id;
			}

			$endpoint = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . "/signalr/organizations/hub/negotiate";
			$url      = add_query_arg( array_filter( $query_params ), $endpoint );

			$decoded = Catcher24Client::request( 'POST', $url );

			$decoded['url']         = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . "/signalr/organizations/hub";

			return new \WP_REST_Response( $decoded, 200 );

		} catch ( Exception $e ) {
			return new \WP_REST_Response( array( 'message' => $e->getMessage() ), 500 );
		}
	}
}
