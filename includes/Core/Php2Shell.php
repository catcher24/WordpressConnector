<?php

namespace Catcher24\WordPress_Connector\Core;

defined('ABSPATH') || exit;

use Catcher24\WordPress_Connector\Traits\Base;

/**
 * Class Php2Shell
 *
 * Detects whether the running PHP version is affected by
 * CVE-2026-109618 / CVE-2026-109619 ("php2shell").
 *
 * @see https://www.php.net/index.php#2026-10-21-5
 * @package Catcher24\WordPress_Connector\Core
 */
class Php2Shell
{

  use Base;

  /**
   * First patched release per supported PHP branch, as announced by php.net on 2026-10-21.
   *
   * Branches older than the lowest key are end-of-life and receive no fix.
   * Branches newer than the highest key shipped after the fix.
   *
   * @var array<string, string>
   */
  const FIXED_VERSIONS = array(
    '8.2' => '8.2.35',
    '8.3' => '8.3.36',
    '8.4' => '8.4.27',
    '8.5' => '8.5.12',
  );

  /**
   * Option storing the PHP version an admin confirmed as patched by their host.
   */
  const OPTION_CONFIRMED = 'catcher24_php2shell_confirmed_patched';

  /**
   * admin-post.php action for confirming / revoking the confirmation.
   */
  const ACTION_CONFIRM = 'catcher24_php2shell_confirm';

  const ADVISORY_URL = 'https://www.php.net/index.php#2026-10-21-5';

  const STATE_PATCHED = 'patched';
  const STATE_CONFIRMED = 'confirmed';
  const STATE_VULNERABLE = 'vulnerable';
  const STATE_EOL = 'eol';
  const STATE_UNVERIFIED = 'unverified';

  /**
   * Registers the confirmation handler.
   *
   * @return void
   */
  public function init()
  {
    add_action('admin_post_' . self::ACTION_CONFIRM, array($this, 'handle_confirm'));
  }

  /**
   * Returns the php2shell status of the running PHP binary.
   *
   * @return array{state: string, php_version: string, fixed_version: string|null, confirmed_by: string|null}
   */
  public function get_status()
  {
    $status = self::evaluate(
      PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . '.' . PHP_RELEASE_VERSION,
      PHP_EXTRA_VERSION
    );
    $status['php_version'] = PHP_VERSION;
    $status['confirmed_by'] = null;

    if (in_array($status['state'], array(self::STATE_VULNERABLE, self::STATE_UNVERIFIED, self::STATE_EOL), true)) {
      /**
       * Filters whether the server is known to be patched against php2shell,
       * e.g. because the host backported the fix without changing the PHP version.
       *
       * @param bool $patched Whether the server is patched. Default false.
       */
      if (apply_filters('catcher24_php2shell_patched', false)) {
        $status['state'] = self::STATE_CONFIRMED;
        $status['confirmed_by'] = 'host';
      } elseif (get_option(self::OPTION_CONFIRMED) === PHP_VERSION) {
        $status['state'] = self::STATE_CONFIRMED;
        $status['confirmed_by'] = 'admin';
      }
    }

    return $status;
  }

  /**
   * Determines the php2shell state for a PHP version.
   *
   * @param string $version       Numeric PHP version, e.g. "8.3.12".
   * @param string $extra_version PHP_EXTRA_VERSION, set by distribution builds (e.g. "-1+deb12u3").
   * @return array{state: string, fixed_version: string|null}
   */
  public static function evaluate($version, $extra_version = '')
  {
    $parts  = explode('.', $version);
    $branch = $parts[0] . '.' . (isset($parts[1]) ? (int) $parts[1] : 0);

    // Distribution builds (Debian, Ubuntu, ...) backport fixes without bumping the version,
    // including to end-of-life branches. deb.sury.org builds track upstream releases.
    $is_distribution_build = '' !== $extra_version && false === strpos($extra_version, 'deb.sury.org');

    if (!isset(self::FIXED_VERSIONS[$branch])) {
      $oldest_supported = array_keys(self::FIXED_VERSIONS)[0];

      if (version_compare($branch, $oldest_supported, '>=')) {
        $state = self::STATE_PATCHED;
      } else {
        $state = $is_distribution_build ? self::STATE_UNVERIFIED : self::STATE_EOL;
      }

      return array(
        'state'         => $state,
        'fixed_version' => null,
      );
    }

    $fixed_version = self::FIXED_VERSIONS[$branch];

    if (version_compare($version, $fixed_version, '>=')) {
      $state = self::STATE_PATCHED;
    } elseif ($is_distribution_build) {
      $state = self::STATE_UNVERIFIED;
    } else {
      $state = self::STATE_VULNERABLE;
    }

    return array(
      'state'         => $state,
      'fixed_version' => $fixed_version,
    );
  }

  /**
   * Whether the current user should see the php2shell banner.
   *
   * End-of-life versions are left to WordPress core's own "PHP Update Required" notice.
   *
   * @return bool
   */
  public function should_show_banner()
  {
    return current_user_can('update_php') && self::STATE_VULNERABLE === $this->get_status()['state'];
  }

  /**
   * URL that marks (or unmarks) the current PHP version as patched by the host.
   *
   * Returned unescaped (unlike wp_nonce_url()) so it can also be passed to the React app;
   * escape with esc_url() when printing it in HTML.
   *
   * @param bool $confirmed Whether to confirm or revoke.
   * @return string
   */
  public function get_confirm_url($confirmed = true)
  {
    return add_query_arg(
      array(
        'action'    => self::ACTION_CONFIRM,
        'confirmed' => $confirmed ? '1' : '0',
        '_wpnonce'  => wp_create_nonce(self::ACTION_CONFIRM),
      ),
      admin_url('admin-post.php')
    );
  }

  /**
   * Handles the "my host has patched this" confirmation.
   *
   * @return void
   */
  public function handle_confirm()
  {
    if (!current_user_can('update_php')) {
      wp_die(esc_html__('You are not allowed to do this.', 'catcher24-connector'), 403);
    }

    check_admin_referer(self::ACTION_CONFIRM);

    if (isset($_GET['confirmed']) && '1' === $_GET['confirmed']) {
      update_option(self::OPTION_CONFIRMED, PHP_VERSION, false);
    } else {
      delete_option(self::OPTION_CONFIRMED);
    }

    wp_safe_redirect(wp_get_referer() ? wp_get_referer() : admin_url());
    exit;
  }
}
