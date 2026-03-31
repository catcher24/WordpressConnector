<?php

namespace Catcher24\WordPress_Connector\Controllers\Accounts;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;
use Exception;
use WP_REST_Request;

class Actions {

	public function signin( WP_REST_Request $request ) {
		$authUrl = Catcher24Client::generate_login_flow();

		wp_redirect( $authUrl );
		exit;
	}

	public function callback( WP_REST_Request $request ) {
		$code  = $request->get_param( 'code' ) ?: ( $_GET['code'] ?? null );
		$state = $request->get_param( 'state' ) ?: ( $_GET['state'] ?? null );
		$error = $request->get_param( 'error' ) ?: ( $_GET['error'] ?? null );

		if ( empty( $code ) && empty( $error ) ) {
			parse_str( $_SERVER['QUERY_STRING'], $manual_params );

			$code  = $manual_params['code']  ?? null;
			$state = $manual_params['state'] ?? null;
			$error = $manual_params['error'] ?? null;
		}

		if ( $error === 'temporarily_unavailable' ) {
			$login_page_url = admin_url( 'admin.php?page=catcher24-wordpress-connector#/dashboard' );
			wp_redirect( $login_page_url );
			exit;
		}

		if ( $error === 'temporarily_unavailable' || $error === 'login_required' || $error === 'interaction_required' ) {
			$login_page_url = admin_url( 'admin.php?page=catcher24-wordpress-connector#/login' );
			wp_redirect( $login_page_url );
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

			$react_app_url = admin_url( 'admin.php?page=catcher24-wordpress-connector#/dashboard' );
			wp_redirect( $react_app_url );
			exit;

		} catch ( Exception $e ) {
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

		wp_redirect( $logout_url );
		exit;
	}
}
