<?php

namespace Catcher24\WordPress_Connector\Core;

use Catcher24\WordPress_Connector\Libs\API\Config;
use Catcher24\WordPress_Connector\Traits\Base;

/**
 * Class API
 *
 * Initializes and configures the API for the Catcher24\WordPress_Connector.
 *
 * @package Catcher24\WordPress_Connector\Core
 */
class API
{

  use Base;

  /**
   * Initializes the API for the Catcher24\WordPress_Connector.
   *
   * @return void
   */
  public function init()
  {
    Config::set_route_file(CATCHER24_DIR . '/includes/Routes/Api.php')
      ->set_namespace('Catcher24\WordPress_Connector\Api')
      ->init();
  }
}
