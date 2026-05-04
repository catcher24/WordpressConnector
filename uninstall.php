<?php
/**
 * Uninstall the plugin
 *
 * @package WordPress_Plugin_Boilerplate
 * @subpackage Database
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

$options_to_delete = [
  'catcher24_saas_connection',
  'catcher24_selected_tenant',
  'catcher24_selected_organization',
  'catcher24_selected_target',
];

foreach ( $options_to_delete as $option ) {
  delete_option( $option );
}
