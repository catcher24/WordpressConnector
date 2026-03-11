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
		$code  = $request->get_param( 'code' );
		$state = $request->get_param( 'state' );
		$error = $request->get_param( 'error' );

		if ( $error === 'login_required' || $error === 'interaction_required' ) {
			$login_page_url = admin_url( 'admin.php?page=catcher24-wordpress-connector#/login' );
			wp_redirect( $login_page_url );
			exit;
		}

		if ( empty( $code ) ) {
			return Messages::error_auth_failed( 'Authorization code missing. Your server might be stripping query parameters.' );
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
		Catcher24Client::disconnect();
		return Messages::success_signout();
	}
}
