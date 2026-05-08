<?php

namespace Catcher24\WordPress_Connector\Controllers\Accounts;

class Messages
{
  public static function success_signin($accessToken, $refreshToken)
  {
    return array(
      'status' => 'success',
      'access_token' => $accessToken,
      'refresh_token' => $refreshToken,
    );
  }

  public static function error_auth_failed($error)
  {
    return array(
      'status' => 'error',
      'message' => 'Authentication failed: ' . $error,
    );
  }

  public static function error_missing_token()
  {
    return array(
      'status' => 'error',
      'message' => 'Missing authorization token.',
    );
  }

  public static function user_data($data)
  {
    return array(
      'status' => 'success',
      'data' => $data,
    );
  }

  public static function error_user_details_failed($error)
  {
    return array(
      'status' => 'error',
      'message' => 'Failed to fetch user details: ' . $error,
    );
  }

  public static function success_signout($logoutUrl)
  {
    return array(
      'status' => 'success',
      'message' => 'Signed out successfully.',
      'logout_url' => $logoutUrl,
    );
  }
}
