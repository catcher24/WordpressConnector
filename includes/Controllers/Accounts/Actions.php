<?php

namespace Catcher24\WordPress_Connector\Controllers\Accounts;

defined( 'ABSPATH' ) || exit;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;
use Exception;
use WP_REST_Request;
use WP_REST_Response;

class Actions {

  public function signin(WP_REST_Request $request) {
    $authUrl = Catcher24Client::generate_login_flow();

    return new WP_REST_Response([
      'redirect_url' => $authUrl
    ], 200);
  }

	public function callback( WP_REST_Request $request ) {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- Accessing OAuth callback parameters, which are validated via state parameter rather than nonces
		$code     = $request->get_param( 'code' ) ?: ( isset( $_GET['code'] ) ? sanitize_text_field( wp_unslash( $_GET['code'] ) ) : null );
		$state    = $request->get_param( 'state' ) ?: ( isset( $_GET['state'] ) ? sanitize_text_field( wp_unslash( $_GET['state'] ) ) : null );
		$error    = $request->get_param( 'error' ) ?: ( isset( $_GET['error'] ) ? sanitize_text_field( wp_unslash( $_GET['error'] ) ) : null );
		$is_retry = ( $request->get_param( 'retry' ) ?: ( isset( $_GET['retry'] ) ? sanitize_text_field( wp_unslash( $_GET['retry'] ) ) : null ) ) === '1';

		if ( empty( $code ) && empty( $error ) ) {
			$query_string = isset( $_SERVER['QUERY_STRING'] ) ? sanitize_text_field( wp_unslash( $_SERVER['QUERY_STRING'] ) ) : '';
			parse_str( $query_string, $manual_params );

			$code  = $manual_params['code']  ?? null;
			$state = $manual_params['state'] ?? null;
			$error = $manual_params['error'] ?? null;
		}
		// phpcs:enable WordPress.Security.NonceVerification.Recommended

		if ( $error === 'temporarily_unavailable' ) {
			$login_page_url = admin_url( 'admin.php?page=catcher24-connector#/dashboard' );
			wp_safe_redirect( $login_page_url );
			exit;
		}

		if ( $error === 'temporarily_unavailable' || $error === 'login_required' || $error === 'interaction_required' ) {
			$login_page_url = admin_url( 'admin.php?page=catcher24-connector#/login' );
			wp_safe_redirect( $login_page_url );
			exit;
		}

		if ( ! empty( $error ) ) {
			return Messages::error_auth_failed( (string) $error );
		}

		if ( empty( $code ) ) {
			return Messages::error_auth_failed( $error .  'Authorization code missing. Your server might be stripping query parameters.' );
		}

		try {
			Catcher24Client::handle_callback( $code, $state );

			$react_app_url = admin_url( 'admin.php?page=catcher24-connector#/dashboard' );
			wp_safe_redirect( $react_app_url );
			exit;

		} catch ( Exception $e ) {
			// If state is missing/expired and we haven't already tried to recover
			if ( $e->getMessage() === 'Invalid state or expired session.' && ! $is_retry ) {

				// Generate a fresh login URL (this saves a new transient internally)
				$retry_auth_url = Catcher24Client::generate_login_flow();

				// Append retry flag to the redirect_uri inside the Keycloak URL
				// so we can detect it when the user comes back
				$retry_auth_url = add_query_arg( 'retry', '1', $retry_auth_url );

				wp_safe_redirect( $retry_auth_url );
				exit;
			}

			// If it still fails or it's a different error, show the message
			return Messages::error_auth_failed( $e->getMessage() );
		}
	}

	public function status() {
		$is_connected = Catcher24Client::is_connected();
		return Messages::connection_status( $is_connected );
	}

	public function disconnect() {
		$logout_url = Catcher24Client::get_logout_url();

		// Clear local session first
		Catcher24Client::disconnect();

		wp_safe_redirect( $logout_url );
		exit;
	}
}
