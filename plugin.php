<?php
use Catcher24\WordPress_Connector\Core\Api;
use Catcher24\WordPress_Connector\Admin\Menu;
use Catcher24\WordPress_Connector\Core\Template;
use Catcher24\WordPress_Connector\Assets\Admin;
use Catcher24\WordPress_Connector\Traits\Base;

defined( 'ABSPATH' ) || exit;

/**
 * Class Catcher24_Connector
 *
 * The main class for the Catcher24 connector plugin, responsible for initialization and setup.
 *
 * @since 1.0.0
 */
final class Catcher24_Connector {

	use Base;

	/**
	 * Class constructor to set up constants for the plugin.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __construct() {
		define( 'CATCHER24_VERSION', '1.0.0' );
		define( 'CATCHER24_PLUGIN_FILE', __FILE__ );
		define( 'CATCHER24_DIR', plugin_dir_path( __FILE__ ) );
		define( 'CATCHER24_URL', plugin_dir_url( __FILE__ ) );
		define( 'CATCHER24_ASSETS_URL', CATCHER24_URL . '/assets' );
		define( 'CATCHER24_ROUTE_PREFIX', 'catcher24/v1' );
		define( 'CATCHER24_DASHBOARD_URL', 'https://dev.catcher24.net/' );
		define( 'CATCHER24_AUTH_URL', 'https://auth.dev.catcher24.net' );
		define( 'CATCHER24_API_GATEWAY_URL', 'https://wordpress-connector-api-gateway.dev.catcher24.net/' );
		define( 'CATCHER24_SETTING_SELECTED_TENANT', 'catcher24_selected_tenant' );
		define( 'CATCHER24_SETTING_SELECTED_ORGANIZATION', 'catcher24_selected_organization' );
		define( 'CATCHER24_SETTING_SELECTED_TARGET', 'catcher24_selected_target' );
	}

	/**
	 * Main execution point where the plugin will fire up.
	 *
	 * Initializes necessary components for both admin and frontend.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function init() {
		if ( is_admin() ) {
			Menu::get_instance()->init();
			Admin::get_instance()->bootstrap();
		}

		// Initialze core functionalities.
		API::get_instance()->init();
    Template::get_instance()->init();

		add_action( 'init', array( $this, 'i18n' ) );
		add_action( 'admin_init', array( $this, 'add_privacy_policy_content' ) );
	}

	/**
	 * Registers privacy policy content for the plugin.
	 * 
	 * @since 1.0.0
	 */
	public function add_privacy_policy_content() {
		if ( ! function_exists( 'wp_add_privacy_policy_content' ) ) {
			return;
		}

		$content = sprintf(
			/* translators: %s: URL to the privacy policy */
			__( 'When you use the Catcher24 Connector, we may collect and transmit telemetry, security configuration, and site status information to the Catcher24 cybersecurity platform. This includes server IP addresses, software versions, and potentially access logs to identify emerging threats. This data is transmitted securely and is governed by the Catcher24 privacy policy. For more information, please see our <a href="%s">Privacy Policy</a>.', 'catcher24-connector' ),
			'https://catcher24.com/privacy'
		);

		wp_add_privacy_policy_content(
			__( 'Catcher24 Connector', 'catcher24-connector' ),
			$content
		);
	}




	/**
	 * Internationalization setup for language translations.
	 *
	 * Loads the plugin text domain for localization.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function i18n() {
		// WordPress 4.6+ automatically loads translations from the languages directory.
	}
}
