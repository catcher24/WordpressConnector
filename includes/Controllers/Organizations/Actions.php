<?php

namespace Catcher24\WordPress_Connector\Controllers\Organizations;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;
use Exception;

class Actions {
	public function get_organizations() {
		try {
			$token = Catcher24Client::get_valid_token();
		} catch ( Exception $e ) {
			return [];
		}

		$token_parts = explode( '.', $token );
		if ( count( $token_parts ) !== 3 ) {
			return [];
		}

		// Note: If you ever encounter JWT decoding issues, using strtr() for base64url decoding is safer:
		// base64_decode( strtr( $token_parts[1], '-_', '+/' ) )
		$payload = json_decode( base64_decode( $token_parts[1] ), true );
		$tenant_id = $payload['__tenant__'] ?? null;
		$organizations_claim = $payload['organizations'] ?? null;

		if ( ! $tenant_id || empty( $organizations_claim ) ) {
			return [];
		}

		if ( is_string( $organizations_claim ) ) {
			$organizations_claim = json_decode( $organizations_claim, true );
		}

		$fetched_organizations = [];

		foreach ( $organizations_claim as $org_data ) {
			if ( empty( $org_data['name'] ) ) {
				continue;
			}

			$organization_id = $org_data['name'];
			$endpoint = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . "/api/tenants/{$tenant_id}/organizations/by-id/{$organization_id}";

			try {
				$fetched_organizations[] = Catcher24Client::request( 'GET', $endpoint );
			} catch ( Exception $e ) {
				continue;
			}
		}

		return $fetched_organizations;
	}

	/**
	 * Get a single organization by ID.
	 *
	 * @param \WP_REST_Request $request
	 * @return array|\WP_REST_Response
	 */
	public function get_organization( \WP_REST_Request $request ) {
		$organization_id = $request->get_param( 'organizationId' );

		if ( empty( $organization_id ) ) {
			return new \WP_REST_Response( [ 'message' => 'Organization ID is missing' ], 400 );
		}

		try {
			$token = Catcher24Client::get_valid_token();
			$token_parts = explode( '.', $token );
			$payload = json_decode( base64_decode( $token_parts[1] ), true );
			$tenant_id = $payload['__tenant__'] ?? null;

			if ( ! $tenant_id ) {
				return new \WP_REST_Response( [ 'message' => 'Invalid tenant session' ], 401 );
			}

			$endpoint = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . "/api/tenants/{$tenant_id}/organizations/by-id/{$organization_id}";

			return Catcher24Client::request( 'GET', $endpoint );

		} catch ( Exception $e ) {
			return new \WP_REST_Response( [ 'message' => $e->getMessage() ], 500 );
		}
	}

	public function select_organization( \WP_REST_Request $request ) {
		$body = json_decode( $request->get_body(), true );
		$organization_id = $body['organization_id'] ?? '';

		if ( empty( $organization_id ) ) {
			return new \WP_REST_Response( [ 'message' => 'Organization ID is required' ], 400 );
		}

		update_option( CATCHER24_SETTING_SELECTED_ORGANIZATION, $organization_id );

		return new \WP_REST_Response( [ 'message' => 'Organization selected successfully' ], 200 );
	}

	public function get_scanners( \WP_REST_Request $request ) {
		$response = Catcher24Client::proxy_request( 'GET', 'scanners', $request->get_query_params(), [], true, true );

		return Catcher24Client::resolve_proxy_response( $response );
	}
}
