<?php

namespace Catcher24\WordPress_Connector\Admin;

use Catcher24\WordPress_Connector\Traits\Base;

/**
 * Class Menu
 *
 * Represents the admin menu management for the Catcher24\WordPress_Connector plugin.
 *
 * @package Catcher24\WordPress_Connector\Admin
 */
class Menu {

	use Base;

	/**
	 * Parent slug for the menu.
	 *
	 * @var string
	 */
	private $parent_slug = 'catcher24-wordpress-connector';

	/**
	 * Initializes the admin menu.
	 *
	 * @return void
	 */
	public function init() {
		// Hook the function to the admin menu.
		add_action( 'admin_menu', array( $this, 'menu' ) );
	}

	/**
	 * Adds a menu to the WordPress admin dashboard.
	 *
	 * @return void
	 */
	public function menu() {

    $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/></svg>';

    $icon_url = 'data:image/svg+xml;base64,' . base64_encode( $svg );

		add_menu_page(
			__( 'Catcher24', 'catcher24-wordpress-connector' ),
			__( 'Catcher24', 'catcher24-wordpress-connector' ),
			'manage_options',
			$this->parent_slug,
			array( $this, 'admin_page' ),
      $icon_url,
			3
		);

		$plugin_url = admin_url( '/admin.php?page=' . $this->parent_slug );

		$current_page = get_admin_page_parent();

		if ( $current_page === $this->parent_slug ) {
			$plugin_url = '';
		}
	}

	/**
	 * Callback function for the main "Catcher24 Connector" menu page.
	 *
	 * @return void
	 */
	public function admin_page() {
		?>
		<div id="catcher24Connector" class="catcher24Connector-app"></div>
		<?php
	}
}
