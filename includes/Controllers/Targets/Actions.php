<?php

namespace Catcher24\WordPress_Connector\Controllers\Targets;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;
use Catcher24\WordPress_Connector\Traits\Sanitization;
use WP_REST_Request;
use WP_REST_Response;

class Actions
{
  use Sanitization;

  /**
   * Get available targets for the selected organization.
   */

  public function get_targets(WP_REST_Request $request)
  {
    $response = Catcher24Client::proxy_request('GET', 'targets', $request->get_query_params(), [], true, true);

    return Catcher24Client::resolve_proxy_response($response);
  }

  public function get_target(\WP_REST_Request $request)
  {
    $target_id = $request->get_param('targetId');
    if (!$target_id) return new \WP_REST_Response(array('message' => 'Missing target context'), 400);

    $response = Catcher24Client::proxy_request('GET', "targets/{$target_id}", $request->get_query_params(), [], true, true);
    return Catcher24Client::resolve_proxy_response($response);
  }

  /**
   * Save the selected target ID and handle creation logic.
   */
  public function select_target(WP_REST_Request $request)
  {
    $body = json_decode($request->get_body(), true);
    $target_id = $body['target_id'] ?? '';

    if (empty($target_id)) {
      return new WP_REST_Response(array('message' => 'Target ID is required'), 400);
    }

    update_option('catcher24_selected_target', sanitize_text_field($target_id));

    return new WP_REST_Response(array('message' => 'Target selected successfully'), 200);
  }

  /**
   * Remove current target
   */
  public function deselect_target(WP_REST_Request $request)
  {

    update_option('catcher24_selected_target', null);

    return new WP_REST_Response(array('message' => 'Target deselected successfully'), 200);
  }

  /**
   * Create a new target via the SaaS API.
   */
  public function create_target(\WP_REST_Request $request)
  {
    $body = json_decode($request->get_body(), true);
    $body = is_array($body) ? $this->sanitize_array($body) : [];

    // Apply object casting
    $body = $this->force_empty_configs_to_objects($body);

    $response = Catcher24Client::proxy_request('POST', 'targets', $request->get_query_params(), $body, true, true);
    $resolved = Catcher24Client::resolve_proxy_response($response, 201);

    if ($resolved instanceof \WP_REST_Response && $resolved->get_status() === 201) {
      $data = $resolved->get_data();
      if (isset($data->id)) {
        update_option(CATCHER24_SETTING_SELECTED_TARGET, $data->id);
      }
    }

    return $resolved;
  }

  /**
   * Update an existing target via the SaaS API.
   */
  public function update_target(\WP_REST_Request $request)
  {
    $target_id = sanitize_text_field($request->get_param('targetId'));
    if (!$target_id) return new \WP_REST_Response(array('message' => 'Missing target context'), 400);

    $body = json_decode($request->get_body(), true);
    $body = is_array($body) ? $this->sanitize_array($body) : [];

    // Apply object casting
    $body = $this->force_empty_configs_to_objects($body);

    $response = Catcher24Client::proxy_request('PUT', "targets/{$target_id}", $request->get_query_params(), $body, true, true);

    return Catcher24Client::resolve_proxy_response($response);
  }

  public function get_vulnerabilities(\WP_REST_Request $request)
  {
    $target_id = $request->get_param('targetId');
    if (!$target_id) return new \WP_REST_Response(array('message' => 'Missing target context'), 400);

    $response = Catcher24Client::proxy_request('GET', 'vulnerabilities', $request->get_query_params(), [], true, true, $target_id);
    return Catcher24Client::resolve_proxy_response($response);
  }

  public function get_scans(\WP_REST_Request $request)
  {
    $target_id = $request->get_param('targetId');
    if (!$target_id) return new \WP_REST_Response(array('message' => 'Missing target context'), 400);

    $response = Catcher24Client::proxy_request('GET', 'scans', $request->get_query_params(), [], true, true, $target_id);
    return Catcher24Client::resolve_proxy_response($response);
  }

  public function get_certificates(\WP_REST_Request $request)
  {
    $target_id = $request->get_param('targetId');
    if (!$target_id) return new \WP_REST_Response(array('message' => 'Missing target context'), 400);

    $response = Catcher24Client::proxy_request('GET', 'certificates', $request->get_query_params(), [], true, true, $target_id);
    return Catcher24Client::resolve_proxy_response($response);
  }

  public function get_root_domains(\WP_REST_Request $request)
  {
    $target_id = $request->get_param('targetId');
    if (!$target_id) return new \WP_REST_Response(array('message' => 'Missing target context'), 400);

    $response = Catcher24Client::proxy_request('GET', 'rootDomains', $request->get_query_params(), [], true, true, $target_id);
    return Catcher24Client::resolve_proxy_response($response);
  }

  public function get_ports(\WP_REST_Request $request)
  {
    $target_id = $request->get_param('targetId');
    if (!$target_id) return new \WP_REST_Response(array('message' => 'Missing target context'), 400);

    $response = Catcher24Client::proxy_request('GET', 'ports', $request->get_query_params(), [], true, true, $target_id);
    return Catcher24Client::resolve_proxy_response($response);
  }

  public function start_scan(\WP_REST_Request $request)
  {
    $target_id = sanitize_text_field($request->get_param('targetId'));
    $scanner_id = sanitize_text_field($request->get_param('scannerId'));
    if (!$target_id || !$scanner_id) return new \WP_REST_Response(array('message' => 'Missing target or scanner context'), 400);

    $body = json_decode($request->get_body(), true);
    if (is_array($body)) {
      $body = $this->sanitize_array($body);
    } else {
      $body = new \stdClass(); // Or [] depending on your client's expectation
    }
    $response = Catcher24Client::proxy_request('POST', "scanners/{$scanner_id}/start", $request->get_query_params(), $body, true, true, $target_id);
    return Catcher24Client::resolve_proxy_response($response);
  }

  public function cancel_scan(\WP_REST_Request $request)
  {
    $target_id = sanitize_text_field($request->get_param('targetId'));
    $scan_id = sanitize_text_field($request->get_param('scanId'));
    if (!$target_id || !$scan_id) return new \WP_REST_Response(array('message' => 'Missing target or scan context'), 400);

    $body = json_decode($request->get_body(), true);
    if (is_array($body)) {
      $body = $this->sanitize_array($body);
    } else {
      $body = new \stdClass(); // Or [] depending on your client's expectation
    }
    $response = Catcher24Client::proxy_request('POST', "scans/{$scan_id}/cancel", $request->get_query_params(), $body, true, true, $target_id);
    return Catcher24Client::resolve_proxy_response($response);
  }

  /**
   * Ensures specific nested keys are treated as JSON objects {} instead of arrays [].
   */
  private function force_empty_configs_to_objects(array $body)
  {
    if (isset($body['scannerConfigurations']) && is_array($body['scannerConfigurations'])) {
      foreach ($body['scannerConfigurations'] as &$config) {
        // Check 'configuration'
        if (isset($config['configuration']) && empty($config['configuration'])) {
          $config['configuration'] = (object)[];
        }
        // Check 'confidentialConfiguration'
        if (isset($config['confidentialConfiguration']) && empty($config['confidentialConfiguration'])) {
          $config['confidentialConfiguration'] = (object)[];
        }
      }
      unset($config);
    }
    return $body;
  }
}
