<?php
use Catcher24\WordPress_Connector\Core\Api;
use Catcher24\WordPress_Connector\Admin\Menu;
use Catcher24\WordPress_Connector\Core\Template;
use Catcher24\WordPress_Connector\Assets\Frontend;
use Catcher24\WordPress_Connector\Assets\Admin;
use Catcher24\WordPress_Connector\Traits\Base;

defined( 'ABSPATH' ) || exit;

/**
 * Class Catcher24_Wordpress_Connector
 *
 * The main class for the Coldmailar plugin, responsible for initialization and setup.
 *
 * @since 1.0.0
 */
final class Catcher24_Wordpress_Connector {

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
		define( 'CATCHER24_ROUTE_PREFIX', 'wordpress-plugin-boilerplate/v1' );
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
		Frontend::get_instance()->bootstrap();
		API::get_instance()->init();
		Template::get_instance()->init();

		add_action( 'init', array( $this, 'i18n' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
	}

	public function register_blocks() {
		register_block_type(__DIR__ . '/assets/blocks/block-1');
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
		load_plugin_textdomain( 'wordpress-plugin-boilerplate', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}
}
