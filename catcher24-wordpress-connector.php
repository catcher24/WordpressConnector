<?php
/**
 * Plugin Name: Catcher24 WP Connector
 * Plugin URI: https://github.com/catcher24/WordpressConnector
 * Description: Seamlessly connect your WordPress site to the Catcher24 cybersecurity dashboard for automated vulnerability scanning, real-time threat alerts, and continuous security monitoring.
 * Author: Catcher24
 * Author URI: https://catcher24.com
 * License: GPLv2
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * Text Domain: catcher24-wordpress-connector
 * Domain Path: /languages
 *
 * @package Catcher24 WP Connector
 */

use Catcher24\WordPress_Connector\Core\Install;

defined( 'ABSPATH' ) || exit;

require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
require_once plugin_dir_path(__FILE__) . 'plugin.php';

/**
 * Initializes the Catcher24_Wordpress_Connector plugin when plugins are loaded.
 *
 * @since 1.0.0
 * @return void
 */
function catcher24_wordpress_connector_init() {
	Catcher24_Wordpress_Connector::get_instance()->init();
}

// Hook for plugin initialization.
add_action( 'plugins_loaded', 'catcher24_wordpress_connector_init' );

// Hook for plugin activation.
register_activation_hook( __FILE__, array( Install::get_instance(), 'init' ) );
