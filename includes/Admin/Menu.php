<?php

namespace Catcher24\WordPress_Connector\Admin;

defined( 'ABSPATH' ) || exit;

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
	private $parent_slug = 'catcher24-connector';

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

    $svg = '<?xml version="1.0" encoding="UTF-8"?>
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.6 57.9">
              <defs>
                <style>
                  .cls-1 {
                    fill: #e5e7eb;
                    fill-rule: evenodd;
                  }
                </style>
              </defs>
              <path class="cls-1" d="M32.41,13.63c-7.94,0-14.38,6.53-14.38,14.58s6.44,14.58,14.38,14.58c6.61,0,12.18-4.53,13.86-10.69h-7.78c-1.27,2.04-3.52,3.4-6.08,3.4-3.97,0-7.19-3.26-7.19-7.29s3.22-7.29,7.19-7.29c2.76,0,5.15,1.58,6.36,3.89h7.62c-1.51-6.41-7.2-11.18-13.98-11.18ZM1.45,16.7C9.25,1.69,51.63-5.18,60.05,4.45c8.42,9.63-4.8,49-22.91,53.07C19.01,61.6-6.35,31.71,1.45,16.7Z"/>
            </svg>';

    $icon_url = 'data:image/svg+xml;base64,' . base64_encode( $svg );

		add_menu_page(
			__( 'Catcher24', 'catcher24-connector' ),
			__( 'Catcher24', 'catcher24-connector' ),
			'manage_options',
			$this->parent_slug,
			array( $this, 'admin_page' ),
      $icon_url,
			3
		);
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
