<?php

namespace Catcher24\WordPress_Connector\Controllers\Collectors;

use Catcher24\WordPress_Connector\Libs\API\Catcher24Client;

class Actions
{
  public function get_collectors(\WP_REST_Request $request)
  {
    return Catcher24Client::proxy_request('GET', 'collectors', $request->get_query_params());
  }
}
