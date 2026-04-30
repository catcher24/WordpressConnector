<?php
/**
 * Plugin Function file.
 *
 * @since 1.0.0
 *
 * @package WordPress Plugin Boilerplate
 */

defined( 'ABSPATH' ) || exit;

/**
 * Retrieves the configuration from the specified file.
 *
 * @param string $config_file_name The name of the configuration file.
 * @return array
 *
 * @since 1.0.0
 */
function catcher24_wp_connector_get_config( $config_file_name ) {
	$config_file_path = __DIR__ . '/../config/' . $config_file_name . '.php';
	if ( file_exists( $config_file_path ) ) {
		return require $config_file_path;
	}
	return array();
}
