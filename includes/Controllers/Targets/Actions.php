<?php

namespace Catcher24\WordPress_Connector\Controllers\Targets;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;
use Exception;
use WP_REST_Request;
use WP_REST_Response;

class Actions {

	/**
	 * Get available targets for the selected organization.
	 */

	public function get_targets( WP_REST_Request $request ) {
		$tenant_id = get_option( CATCHER24_SETTING_SELECTED_TENANT );
		$organization_id = get_option( CATCHER24_SETTING_SELECTED_ORGANIZATION );
		if ( ! $organization_id ) return [];

		// Map Gridify-style query params from Angular to your SaaS API
		$query_params = [
			'page'     => $request->get_param( 'page' ) ?? 1,
			'pageSize' => $request->get_param( 'pageSize' ) ?? 20,
			'filter'   => $request->get_param( 'filter' ),
			'orderBy'  => $request->get_param( 'orderBy' ),
		];

		try {
			// Build the URL with query string
			$endpoint = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . "/api/tenants/{$tenant_id}/organizations/{$organization_id}/targets";
			$url = add_query_arg( array_filter( $query_params ), $endpoint );

			return Catcher24Client::request( 'GET', $url );
		} catch ( Exception $e ) {
			return [ 'items' => [], 'totalResults' => 0 ];
		}
	}

	/**
	 * Save the selected target ID and handle creation logic.
	 */
	public function select_target( WP_REST_Request $request ) {
		$body      = json_decode( $request->get_body(), true );
		$target_id = $body['target_id'] ?? '';

		if ( empty( $target_id ) ) {
			return new WP_REST_Response( array( 'message' => 'Target ID is required' ), 400 );
		}

		// Save the selected target to the WordPress database
		update_option( 'catcher24_selected_target', $target_id );

		return new WP_REST_Response( array( 'message' => 'Target selected successfully' ), 200 );
	}

	/**
	 * Create a new target via the SaaS API.
	 */
	public function create_target( WP_REST_Request $request ) {
		$body            = json_decode( $request->get_body(), true );
		$tenant_id = get_option( CATCHER24_SETTING_SELECTED_TENANT );
		$organization_id = get_option( CATCHER24_SETTING_SELECTED_ORGANIZATION );

		if ( ! $organization_id ) {
			return new WP_REST_Response( array( 'message' => 'No organization selected' ), 400 );
		}

		try {
			$endpoint = "/api/tenants/{$tenant_id}/organizations/{$organization_id}/targets";
			$response = Catcher24Client::request( 'POST', $endpoint, $body );

			// If created successfully, we automatically select it
			if ( isset( $response['id'] ) ) {
				update_option( CATCHER24_SETTING_SELECTED_TARGET, $response['id'] );
			}

			return new WP_REST_Response( $response, 201 );
		} catch ( Exception $e ) {
			return new WP_REST_Response( array( 'message' => $e->getMessage() ), 500 );
		}
	}
}
