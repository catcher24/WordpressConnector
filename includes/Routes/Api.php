<?php
/**
 * Catcher24\WordPress_Connector Routes
 *
 * Defines and registers custom API routes for the Catcher24\WordPress_Connector using the Haruncpi\WpApi library.
 *
 * @package Catcher24\WordPress_Connector\Routes
 */

namespace Catcher24\WordPress_Connector\Routes;

defined('ABSPATH') || exit;

use Catcher24\WordPress_Connector\Libs\API\Route;

Route::prefix(
  CATCHER24_ROUTE_PREFIX,
  function (Route $route) {

    // Define accounts API routes.
    $route->get('/accounts/signin', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@signin', false);
    $route->get('/accounts/register', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@register', false);
    $route->get('/accounts/callback', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@callback', false);
    $route->get('/accounts/status', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@status');
    $route->get('/accounts/disconnect', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@disconnect', false);
    $route->post('/accounts/disconnect', '\Catcher24\WordPress_Connector\Controllers\Accounts\Actions@disconnect');

    $route->get('/organizations', '\Catcher24\WordPress_Connector\Controllers\Organizations\Actions@get_organizations');
    $route->post('/organizations/select', '\Catcher24\WordPress_Connector\Controllers\Organizations\Actions@select_organization');

    $route->get('/targets', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@get_targets');
    $route->post('/targets/select', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@select_target');
    $route->post('/targets/deselect', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@deselect_target');
    $route->get('/targets/{targetId}', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@get_target');
    $route->post('/targets', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@create_target');
    $route->put('/targets/{targetId}', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@update_target');
    $route->get('/targets/{targetId}/vulnerabilities', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@get_vulnerabilities');
    $route->get('/targets/{targetId}/scans', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@get_scans');
    $route->get('/targets/{targetId}/certificates', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@get_certificates');
    $route->get('/targets/{targetId}/rootDomains', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@get_root_domains');
    $route->get('/targets/{targetId}/ports', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@get_ports');
    $route->post('/targets/{targetId}/scanners/{scannerId}/start', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@start_scan');
    $route->post('/targets/{targetId}/scans/{scanId}/cancel', '\Catcher24\WordPress_Connector\Controllers\Targets\Actions@cancel_scan');

    $route->get('/scanners', '\Catcher24\WordPress_Connector\Controllers\Organizations\Actions@get_scanners');
    $route->get('/collectors', '\Catcher24\WordPress_Connector\Controllers\Collectors\Actions@get_collectors');
    $route->get('/collectorGroups', '\Catcher24\WordPress_Connector\Controllers\CollectorGroups\Actions@get_collector_groups');

    $route->post('/hub/public', '\Catcher24\WordPress_Connector\Controllers\Hub\Actions@public_negotiate');

    // Allow hooks to add more custom API routes.
    do_action('catcher24_wp_connector_api', $route);

    // Secure all registered routes with manage_options capability
    $route->auth(function () {
      return current_user_can('manage_options');
    });
  }
);
