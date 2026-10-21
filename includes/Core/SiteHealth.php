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
        $paragraphs[] = __('This PHP branch is end-of-life and will not receive a fix. Upgrade to a supported PHP version (8.2 or newer) as soon as possible.', 'catcher24-connector');
        break;

      case Php2Shell::STATE_UNVERIFIED:
        $result['status'] = 'recommended';
        $result['label']  = __('Verify that your PHP version is patched against php2shell', 'catcher24-connector');

        $paragraphs[] = sprintf(
          /* translators: 1: Current PHP version, 2: First patched upstream PHP version. */
          __('PHP %1$s is a distribution build. The upstream fix for CVE-2026-109618 and CVE-2026-109619 is in PHP %2$s, but distributions often backport fixes without changing the version number, so this cannot be verified automatically.', 'catcher24-connector'),
          $status['php_version'],
          $status['fixed_version']
        );
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

    $paragraphs[] = '<em>' . __('Checked by Catcher24 Connector.', 'catcher24-connector') . '</em>';

    $actions[] = sprintf(
      '<a href="%s" target="_blank" rel="noopener">%s<span class="screen-reader-text"> %s</span><span aria-hidden="true" class="dashicons dashicons-external"></span></a>',
      esc_url(Php2Shell::ADVISORY_URL),
      __('Read the CERT-EU advisory', 'catcher24-connector'),
      /* translators: Hidden accessibility text. */
      __('(opens in a new tab)', 'catcher24-connector')
    );

    $result['description'] = '<p>' . implode('</p><p>', $paragraphs) . '</p>';
    $result['actions']     = '<p>' . implode(' | ', $actions) . '</p>';

    return $result;
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
