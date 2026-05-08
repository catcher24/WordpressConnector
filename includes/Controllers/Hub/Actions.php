<?php

namespace Catcher24\WordPress_Connector\Controllers\Hub;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;
use Exception;

class Actions
{

  /**
   * Proxy the SignalR negotiate request to the API Gateway.
   * This handles providing the token to the frontend securely,
   * preventing the full JWT from being hardcoded in localized scripts.
   */
  public function public_negotiate(\WP_REST_Request $request)
  {
    try {
      $query_params = $request->get_query_params();
      $organization_id = get_option(CATCHER24_SETTING_SELECTED_ORGANIZATION);

      if ($organization_id) {
        $query_params['organizationId'] = $organization_id;
      }

      // Get scoped access token that only allows for shortlived hub connection
      $data = Catcher24Client::request('POST', rtrim(CATCHER24_API_GATEWAY_URL, '/') . '/signalr/authorization/ticket');

      $query_params['access_token'] = is_object($data) ? ($data->ticket ?? null) : ($data['ticket'] ?? null);

      $endpoint = rtrim(CATCHER24_API_GATEWAY_URL, '/') . "/signalr/organizations/hub";
      $url = add_query_arg(array_filter($query_params), $endpoint);

      return new \WP_REST_Response(array('url' => $url), 200);

    } catch (Exception $e) {
      return new \WP_REST_Response(array('message' => $e->getMessage()), 500);
    }
  }
}
