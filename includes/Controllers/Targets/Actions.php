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
		$response = Catcher24Client::proxy_request( 'GET', 'targets', $request->get_query_params(), [], true, true );

		// If it failed, proxy_request returns a WP_REST_Response with the error.
		// The original code expects `[ 'items' => [], 'totalResults' => 0 ]` on error.
		if ( is_wp_error( $response ) || ( $response instanceof WP_REST_Response && $response->get_status() >= 400 ) ) {
			return [ 'items' => [], 'totalResults' => 0 ];
		}

		return $response;
	}

	public function get_target( \WP_REST_Request $request ) {
		$target_id = $request->get_param( 'targetId' );
		if ( ! $target_id ) return new \WP_REST_Response( array( 'message' => 'Missing target context' ), 400 );
		return Catcher24Client::proxy_request( 'GET', "targets/{$target_id}", $request->get_query_params(), [], true, true );
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
	 * Remove current target
	 */
	public function deselect_target( WP_REST_Request $request ) {

		update_option( 'catcher24_selected_target', null );

		return new WP_REST_Response( array( 'message' => 'Target deselected successfully' ), 200 );
	}

	/**
	 * Create a new target via the SaaS API.
	 */
	public function create_target( \WP_REST_Request $request ) {
		$body = json_decode( $request->get_body(), true ) ?? [];
		$response = Catcher24Client::proxy_request( 'POST', 'targets', $request->get_query_params(), $body, true, true );

		if ( ! ( $response instanceof \WP_REST_Response ) && isset( $response['id'] ) ) {
			update_option( CATCHER24_SETTING_SELECTED_TARGET, $response['id'] );
			return new WP_REST_Response( $response, 201 );
		}

		return $response;
	}

	/**
	 * Update an existing target via the SaaS API.
	 */
	public function update_target( \WP_REST_Request $request ) {
		$target_id = $request->get_param( 'targetId' );
		if ( ! $target_id ) return new \WP_REST_Response( array( 'message' => 'Missing target context' ), 400 );

		$body = json_decode( $request->get_body(), true ) ?? [];
		
		$response = Catcher24Client::proxy_request( 'PUT', "targets/{$target_id}", $request->get_query_params(), $body, true, true );

		if ( ! ( $response instanceof \WP_REST_Response ) && isset( $response['id'] ) ) {
			return new \WP_REST_Response( $response, 200 );
		}

		return $response;
	}

	public function get_vulnerabilities( \WP_REST_Request $request ) {
		$target_id = $request->get_param( 'targetId' );
		if ( ! $target_id ) return new \WP_REST_Response( array( 'message' => 'Missing target context' ), 400 );
		return Catcher24Client::proxy_request( 'GET', 'vulnerabilities', $request->get_query_params(), [], true, true, $target_id );
	}

	public function get_scans( \WP_REST_Request $request ) {
		$target_id = $request->get_param( 'targetId' );
		if ( ! $target_id ) return new \WP_REST_Response( array( 'message' => 'Missing target context' ), 400 );
		return Catcher24Client::proxy_request( 'GET', 'scans', $request->get_query_params(), [], true, true, $target_id );
	}

	public function get_certificates( \WP_REST_Request $request ) {
		$target_id = $request->get_param( 'targetId' );
		if ( ! $target_id ) return new \WP_REST_Response( array( 'message' => 'Missing target context' ), 400 );
		return Catcher24Client::proxy_request( 'GET', 'certificates', $request->get_query_params(), [], true, true, $target_id );
	}

	public function get_root_domains( \WP_REST_Request $request ) {
		$target_id = $request->get_param( 'targetId' );
		if ( ! $target_id ) return new \WP_REST_Response( array( 'message' => 'Missing target context' ), 400 );
		return Catcher24Client::proxy_request( 'GET', 'rootDomains', $request->get_query_params(), [], true, true, $target_id );
	}

	public function get_ports( \WP_REST_Request $request ) {
		$target_id = $request->get_param( 'targetId' );
		if ( ! $target_id ) return new \WP_REST_Response( array( 'message' => 'Missing target context' ), 400 );
		return Catcher24Client::proxy_request( 'GET', 'ports', $request->get_query_params(), [], true, true, $target_id );
	}

	public function start_scan( \WP_REST_Request $request ) {
		$target_id  = $request->get_param( 'targetId' );
		$scanner_id = $request->get_param( 'scannerId' );
		if ( ! $target_id || ! $scanner_id ) return new \WP_REST_Response( array( 'message' => 'Missing target or scanner context' ), 400 );
		
		$body = json_decode( $request->get_body(), true ) ?? [];
		return Catcher24Client::proxy_request( 'POST', "scanners/{$scanner_id}/start", $request->get_query_params(), $body, true, true, $target_id );
	}

	public function cancel_scan( \WP_REST_Request $request ) {
		$target_id = $request->get_param( 'targetId' );
		$scan_id   = $request->get_param( 'scanId' );
		if ( ! $target_id || ! $scan_id ) return new \WP_REST_Response( array( 'message' => 'Missing target or scan context' ), 400 );
		
		$body = json_decode( $request->get_body(), true ) ?? [];
		return Catcher24Client::proxy_request( 'POST', "scans/{$scan_id}/cancel", $request->get_query_params(), $body, true, true, $target_id );
	}
}
