<?php

namespace Catcher24\WordPress_Connector\Controllers\Accounts;

class Messages
{

  public static function error_auth_failed($error)
  {
    return array(
      'status' => 'error',
      'message' => 'Authentication failed: ' . $error,
    );
  }

  public static function connection_status($isConnected)
  {
    return array(
      'status' => 'success',
      'connected' => $isConnected,
    );
  }
}
