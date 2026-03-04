<?php
/**
 * Catcher24\WordPress_Connector Routes
 *
 * Defines and registers custom API routes for the Catcher24\WordPress_Connector using the Haruncpi\WpApi library.
 *
 * @package Catcher24\WordPress_Connector\Routes
 */

namespace Catcher24\WordPress_Connector\Routes;

use Catcher24\WordPress_Connector\Libs\API\Route;

Route::prefix(
	CATCHER24_ROUTE_PREFIX,
	function ( Route $route ) {

		// Define accounts API routes.

		$route->post( '/accounts/create', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@create' );
		$route->get( '/accounts/get', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@get' );
		$route->post( '/accounts/delete', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@delete' );
		$route->post( '/accounts/update', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@update' );

		// Posts routes.
		$route->get( '/posts/get', '\Catcher24\WordPress_Connector\Controllers\Posts\Actions@get_all_posts' );
		$route->get( '/posts/get/{id}', '\Catcher24\WordPress_Connector\Controllers\Posts\Actions@get_post' );
		// Allow hooks to add more custom API routes.
		do_action( 'c24_api', $route );
	}
);
