<?php

namespace Catcher24\WordPress_Connector\Core;

defined('ABSPATH') || exit;

use Catcher24\WordPress_Connector\Traits\Base;

/**
 * Class SiteHealth
 *
 * Registers Catcher24 security checks in the WordPress Site Health screen.
 *
 * @package Catcher24\WordPress_Connector\Core
 */
class SiteHealth
{

  use Base;

  /**
   * Initializes the Site Health integration.
   *
   * @return void
   */
  public function init()
  {
    add_filter('site_status_tests', array($this, 'register_tests'));
  }

  /**
   * Adds the Catcher24 tests to the Site Health test list.
   *
   * @param array $tests Registered Site Health tests.
   * @return array
   */
  public function register_tests($tests)
  {
    $tests['direct']['catcher24_php2shell'] = array(
      'label' => __('PHP php2shell vulnerability (CVE-2026-109618, CVE-2026-109619)', 'catcher24-connector'),
      'test'  => array($this, 'test_php2shell'),
    );

    return $tests;
  }

  /**
   * Checks whether the running PHP version is patched against
   * CVE-2026-109618 and CVE-2026-109619.
   *
   * @return array Site Health test result.
   */
  public function test_php2shell()
  {
    $php2shell = Php2Shell::get_instance();
    $status    = $php2shell->get_status();

    $result = array(
      'label'       => '',
      'status'      => 'good',
      'badge'       => array(
        'label' => __('Security', 'catcher24-connector'),
        'color' => 'blue',
      ),
      'description' => '',
      'actions'     => '',
      'test'        => 'catcher24_php2shell',
    );

    $paragraphs = array();
    $actions    = array();

    switch ($status['state']) {
      case Php2Shell::STATE_VULNERABLE:
        $result['status']         = 'critical';
        $result['badge']['color'] = 'red';
        $result['label']          = __('Your PHP version is vulnerable to php2shell', 'catcher24-connector');

        $paragraphs[] = $this->get_affected_text($status['php_version']);
        $paragraphs[] = sprintf(
          /* translators: %s: First patched PHP version. */
          __('Upgrade to PHP %s or newer as soon as possible.', 'catcher24-connector'),
          $status['fixed_version']
        );
        $paragraphs[] = __('Some hosting providers backport security fixes without changing the PHP version number. If your host confirms these fixes are installed, you can mark this server as patched.', 'catcher24-connector');
        $actions[]    = $this->get_confirm_link();
        break;

      case Php2Shell::STATE_EOL:
        $result['status']         = 'critical';
        $result['badge']['color'] = 'red';
        $result['label']          = __('Your PHP version is vulnerable to php2shell', 'catcher24-connector');

        $paragraphs[] = $this->get_affected_text($status['php_version']);
        $paragraphs[] = __('This PHP branch is end-of-life and does not receive official fixes. Upgrade to a supported PHP version (8.2 or newer) as soon as possible.', 'catcher24-connector');
        $paragraphs[] = __('Some hosting providers and long-term support vendors provide patched builds of older PHP versions. If your host confirms these fixes are installed, you can mark this server as patched.', 'catcher24-connector');
        $actions[]    = $this->get_confirm_link();
        break;

      case Php2Shell::STATE_UNVERIFIED:
        $result['status'] = 'recommended';
        $result['label']  = __('Verify that your PHP version is patched against php2shell', 'catcher24-connector');

        if (null === $status['fixed_version']) {
          $paragraphs[] = sprintf(
            /* translators: %s: Current PHP version. */
            __('PHP %s is a distribution build of an end-of-life PHP branch. Distributions often backport fixes for CVE-2026-109618 and CVE-2026-109619 without changing the version number, so this cannot be verified automatically. Plan an upgrade to PHP 8.2 or newer.', 'catcher24-connector'),
            $status['php_version']
          );
        } else {
          $paragraphs[] = sprintf(
            /* translators: 1: Current PHP version, 2: First patched upstream PHP version. */
            __('PHP %1$s is a distribution build. The upstream fix for CVE-2026-109618 and CVE-2026-109619 is in PHP %2$s, but distributions often backport fixes without changing the version number, so this cannot be verified automatically.', 'catcher24-connector'),
            $status['php_version'],
            $status['fixed_version']
          );
        }
        $paragraphs[] = __('Install the latest PHP security updates from your distribution or confirm with your host that these fixes are installed, then mark this server as patched.', 'catcher24-connector');
        $actions[]    = $this->get_confirm_link();
        break;

      case Php2Shell::STATE_CONFIRMED:
        $result['label'] = __('Your server is marked as patched against php2shell', 'catcher24-connector');

        if ('host' === $status['confirmed_by']) {
          $paragraphs[] = __('Your hosting provider has marked this server as patched against CVE-2026-109618 and CVE-2026-109619.', 'catcher24-connector');
        } else {
          $paragraphs[] = sprintf(
            /* translators: %s: Current PHP version. */
            __('An administrator confirmed that PHP %s on this server includes the fixes for CVE-2026-109618 and CVE-2026-109619.', 'catcher24-connector'),
            $status['php_version']
          );
          $actions[] = sprintf(
            '<a href="%s">%s</a>',
            esc_url($php2shell->get_confirm_url(false)),
            __('Undo: this server is not patched', 'catcher24-connector')
          );
        }
        break;

      default:
        $result['label'] = __('Your PHP version is patched against php2shell', 'catcher24-connector');

        $paragraphs[] = sprintf(
          /* translators: %s: Current PHP version. */
          __('PHP %s is not affected by the critical remote code execution vulnerabilities CVE-2026-109618 and CVE-2026-109619.', 'catcher24-connector'),
          $status['php_version']
        );
    }

    $actions[] = sprintf(
      '<a href="%s" target="_blank" rel="noopener">%s<span class="screen-reader-text"> %s</span><span aria-hidden="true" class="dashicons dashicons-external"></span></a>',
      esc_url(Php2Shell::ADVISORY_URL),
      __('Read the PHP security advisory', 'catcher24-connector'),
      /* translators: Hidden accessibility text. */
      __('(opens in a new tab)', 'catcher24-connector')
    );

    $result['description'] = '<p>' . implode('</p><p>', $paragraphs) . '</p>';

    if (in_array($status['state'], array(Php2Shell::STATE_VULNERABLE, Php2Shell::STATE_EOL, Php2Shell::STATE_UNVERIFIED), true)) {
      $result['description'] .= $this->get_mitigations_html();
    }

    $result['description'] .= '<p><em>' . esc_html__('Checked by Catcher24 Connector.', 'catcher24-connector') . '</em></p>';
    $result['actions']      = '<p>' . implode(' | ', $actions) . '</p>';

    return $result;
  }

  /**
   * Lists the interim php2shell mitigations from the PHP security advisory,
   * with the current value of each setting.
   *
   * @return string
   */
  private function get_mitigations_html()
  {
    $memory_limit        = (string) ini_get('memory_limit');
    $post_max_size       = (string) ini_get('post_max_size');
    $upload_max_filesize = (string) ini_get('upload_max_filesize');

    $settings = array(
      array(
        'name'        => 'memory_limit',
        'current'     => $memory_limit,
        'recommended' => '-1',
        'applied'     => '-1' === $memory_limit,
      ),
      array(
        'name'        => 'post_max_size',
        'current'     => $post_max_size,
        'recommended' => __('8M, or 32M when file uploads are needed', 'catcher24-connector'),
        'applied'     => wp_convert_hr_to_bytes($post_max_size) > 0 && wp_convert_hr_to_bytes($post_max_size) <= 32 * MB_IN_BYTES,
      ),
      array(
        'name'        => 'upload_max_filesize',
        'current'     => $upload_max_filesize,
        'recommended' => __('Lower than post_max_size', 'catcher24-connector'),
        'applied'     => wp_convert_hr_to_bytes($upload_max_filesize) < wp_convert_hr_to_bytes($post_max_size),
      ),
      array(
        'name'        => 'session.upload_progress.enabled',
        'current'     => ini_get('session.upload_progress.enabled') ? 'On' : 'Off',
        'recommended' => 'Off',
        'applied'     => !ini_get('session.upload_progress.enabled'),
      ),
    );

    // fatal_error_backtraces only exists on PHP 8.5+.
    if (false !== ini_get('fatal_error_backtraces')) {
      $settings[] = array(
        'name'        => 'fatal_error_backtraces',
        'current'     => ini_get('fatal_error_backtraces') ? 'On' : 'Off',
        'recommended' => 'Off',
        'applied'     => !ini_get('fatal_error_backtraces'),
      );
    }

    $rows = '';
    foreach ($settings as $setting) {
      $rows .= sprintf(
        '<tr><td><code>%s</code></td><td><code>%s</code></td><td>%s</td><td>%s</td></tr>',
        esc_html($setting['name']),
        esc_html($setting['current']),
        esc_html($setting['recommended']),
        $setting['applied']
          ? '<span class="dashicons dashicons-yes" style="color:#008a20"></span>' . esc_html__('Applied', 'catcher24-connector')
          : '<span class="dashicons dashicons-no" style="color:#d63638"></span>' . esc_html__('Not applied', 'catcher24-connector')
      );
    }

    return sprintf(
      '<h3>%s</h3><p>%s</p><table class="widefat striped"><thead><tr><th>%s</th><th>%s</th><th>%s</th><th>%s</th></tr></thead><tbody>%s</tbody></table><p>%s</p>',
      esc_html__('Temporary mitigations', 'catcher24-connector'),
      esc_html__('If you cannot upgrade right away, the PHP security team recommends the settings below. They reduce exposure but do not make the server safe; upgrading is the only fix.', 'catcher24-connector'),
      esc_html__('Setting', 'catcher24-connector'),
      esc_html__('Current value', 'catcher24-connector'),
      esc_html__('Recommended', 'catcher24-connector'),
      esc_html__('Status', 'catcher24-connector'),
      $rows,
      esc_html__('Apply these in php.ini, the PHP-FPM pool or the web server configuration (preferably with php_admin_value) and restart all PHP workers. Settings in .user.ini or set by a plugin are not sufficient. Most hosts let you change them in the hosting control panel or via support.', 'catcher24-connector')
    );
  }

  /**
   * Describes the vulnerability for the given PHP version.
   *
   * @param string $php_version PHP version.
   * @return string
   */
  private function get_affected_text($php_version)
  {
    return sprintf(
      /* translators: %s: Current PHP version. */
      __('PHP %s is affected by CVE-2026-109618 and CVE-2026-109619, two critical vulnerabilities (CVSS 9.2) that may allow unauthenticated remote code execution.', 'catcher24-connector'),
      $php_version
    );
  }

  /**
   * Link that marks the current PHP version as patched by the host.
   *
   * @return string
   */
  private function get_confirm_link()
  {
    return sprintf(
      '<a href="%s">%s</a>',
      esc_url(Php2Shell::get_instance()->get_confirm_url()),
      __('My host has patched this', 'catcher24-connector')
    );
  }
}
