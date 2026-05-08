<?php

namespace Catcher24\WordPress_Connector\Controllers\CollectorGroups;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;

class Actions
{
  public function get_collector_groups(\WP_REST_Request $request)
  {
    return Catcher24Client::proxy_request('GET', 'collectorGroups', $request->get_query_params());
  }
}
