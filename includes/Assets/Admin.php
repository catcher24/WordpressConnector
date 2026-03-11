<?php

declare(strict_types=1);

namespace Catcher24\WordPress_Connector\Assets;

use Catcher24\WordPress_Connector\Core\Template;
use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;
use Catcher24\WordPress_Connector\Traits\Base;
use Catcher24\WordPress_Connector\Libs\Assets;

/**
 * Class Admin
 *
 * Handles admin functionalities for the Catcher24\WordPress_Connector.
 *
 * @package Catcher24\WordPress_Connector\Admin
 */
class Admin {

	use Base;

	/**
	 * Script handle for Catcher24\WordPress_Connector.
	 */
	const HANDLE = 'catcher24-wordpress-connector';

	/**
	 * JS Object name for Catcher24\WordPress_Connector.
	 */
	const OBJ_NAME = 'catcher24WordpressConnector';

	/**
	 * Development script path for Catcher24\WordPress_Connector.
	 */
	const DEV_SCRIPT = 'src/admin/main.tsx';

	/**
	 * List of allowed screens for script enqueue.
	 *
	 * @var array
	 */
	private $allowed_screens = array(
		'toplevel_page_catcher24-wordpress-connector',
	);

	/**
	 * Frontend bootstrapper.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_script' ) );
	}

	/**
	 * Enqueue script based on the current screen.
	 *
	 * @param string $screen The current screen.
	 */
	public function enqueue_script( $screen ) {
		$current_screen     = $screen;
		$template_file_name = Template::FRONTEND_TEMPLATE;

		if ( ! is_admin() ) {
			$template_slug = get_page_template_slug();
			if ( $template_slug ) {

				if ( $template_slug === $template_file_name ) {
					array_push( $this->allowed_screens, $template_file_name );
					$current_screen = $template_file_name;
				}
			}
		}

		if ( in_array( $current_screen, $this->allowed_screens, true ) ) {
			Assets\enqueue_asset(
				CATCHER24_DIR . '/assets/admin/dist',
				self::DEV_SCRIPT,
				$this->get_config()
			);
			wp_localize_script( self::HANDLE, self::OBJ_NAME, $this->get_data() );
		}
	}

	/**
	 * Get the script configuration.
	 *
	 * @return array The script configuration.
	 */
	public function get_config() {
		return array(
			'dependencies' => array( 'react', 'react-dom' ),
			'handle'       => self::HANDLE,
			'in-footer'    => true,
		);
	}

	/**
	 * Get data for script localization.
	 *
	 * @return array The localized script data.
	 */
	public function get_data() {
		$token = Catcher24Client::get_valid_token();

		if ( ! $token && get_transient('catcher24_retry_silent_auth') ) {
			// Clean up the flag immediately so we don't loop
			delete_transient('catcher24_retry_silent_auth');

			// Trigger silent re-auth
			$auth_url = Catcher24Client::generate_login_flow( true );
			wp_redirect( $auth_url );
			exit;
		}

		$organization_id = get_option( CATCHER24_SETTING_SELECTED_ORGANIZATION, null );

		// Validate organizationId against the token claims
		if ( $token && $organization_id ) {
			if ( ! $this->is_organization_valid( $token, $organization_id ) ) {
				// Option exists but is no longer valid for this user/session
				delete_option( CATCHER24_SETTING_SELECTED_ORGANIZATION );
				$organization_id = null;
			}
		}

		$target_id = get_option( CATCHER24_SETTING_SELECTED_TARGET, null );

		// Validate targetId against the organization
		if ( $token && $organization_id && $target_id ) {
			if ( ! $this->is_target_valid( $token, $organization_id, $target_id ) ) {
				delete_option( CATCHER24_SETTING_SELECTED_TARGET );
				$target_id = null;
			}
		}

		return array(
			'developer' => 'catcher24',
			'isAdmin'   => is_admin(),
			'apiUrl'    => rest_url(CATCHER24_ROUTE_PREFIX),
			'userInfo'  => Catcher24Client::get_user_info(),
			'organizationId' => $organization_id,
			'targetId' => $target_id,
			'siteName'       => get_bloginfo( 'name' ),
			'siteHostname'   => wp_parse_url( home_url(), PHP_URL_HOST ),
		);
	}

	/**
	 * Validates the selected organization ID against the JWT claims.
	 */
	private function is_organization_valid( string $token, string $org_id ): bool {
		$token_parts = explode( '.', $token );
		if ( count( $token_parts ) !== 3 ) {
			return false;
		}

		$payload = json_decode( base64_decode( $token_parts[1] ), true );
		$organizations_claim = $payload['organizations'] ?? [];

		if ( is_string( $organizations_claim ) ) {
			$organizations_claim = json_decode( $organizations_claim, true );
		}

		if ( ! is_array( $organizations_claim ) ) {
			return false;
		}

		// Check if the org_id exists in the 'name' field of the organizations array
		$valid_ids = array_column( $organizations_claim, 'name' );

		return in_array( $org_id, $valid_ids, true );
	}

	/**
	 * Validates if the selected target belongs to the selected organization.
	 */
	private function is_target_valid( string $token, string $org_id, string $target_id ): bool {
		$transient_key = 'catcher24_target_valid_' . $target_id;
		$cached = get_transient( $transient_key );

		if ( false !== $cached ) {
			return $cached === 'valid';
		}

		$token_parts = explode( '.', $token );
		if ( count( $token_parts ) !== 3 ) {
			return false;
		}

		$payload = json_decode( base64_decode( $token_parts[1] ), true );
		$tenant_id = $payload['__tenant__'] ?? null;

		if ( ! $tenant_id ) {
			return false;
		}

		$endpoint = rtrim( CATCHER24_API_GATEWAY_URL, '/' ) . "/api/tenants/{$tenant_id}/organizations/{$org_id}/targets/{$target_id}";
		
		try {
			Catcher24Client::request( 'GET', $endpoint );
			set_transient( $transient_key, 'valid', 12 * HOUR_IN_SECONDS );
			return true;
		} catch ( \Exception $e ) {
			set_transient( $transient_key, 'invalid', 1 * HOUR_IN_SECONDS );
			return false;
		}
	}
}
