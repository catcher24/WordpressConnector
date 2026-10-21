<?php

namespace Catcher24\WordPress_Connector\Admin;

defined('ABSPATH') || exit;

use Catcher24\WordPress_Connector\Core\Php2Shell;
use Catcher24\WordPress_Connector\Traits\Base;

/**
 * Class Notices
 *
 * Renders Catcher24 security notices on selected WordPress admin screens.
 *
 * @package Catcher24\WordPress_Connector\Admin
 */
class Notices
{

  use Base;

  /**
   * Screens the php2shell notice is shown on. The plugin's own page shows it in the React app.
   *
   * @var string[]
   */
  private $screens = array(
    'dashboard',
    'plugins',
    'update-core',
  );

  /**
   * Initializes the admin notices.
   *
   * @return void
   */
  public function init()
  {
    add_action('admin_notices', array($this, 'php2shell_notice'));
  }

  /**
   * Shows a notice when the running PHP version is vulnerable to php2shell.
   *
   * Disappears automatically once PHP is upgraded or the server is marked as patched.
   *
   * @return void
   */
  public function php2shell_notice()
  {
    $screen = get_current_screen();
    if (!$screen || !in_array($screen->id, $this->screens, true)) {
      return;
    }

    $php2shell = Php2Shell::get_instance();
    if (!$php2shell->should_show_banner()) {
      return;
    }

    $status = $php2shell->get_status();
    ?>
    <div class="notice notice-error">
      <p>
        <strong><?php esc_html_e('Catcher24 Connector: your PHP version is vulnerable to php2shell', 'catcher24-connector'); ?></strong>
      </p>
      <p>
        <?php
        printf(
          /* translators: 1: Current PHP version, 2: First patched PHP version. */
          esc_html__('PHP %1$s is affected by CVE-2026-109618 and CVE-2026-109619, two critical vulnerabilities that may allow unauthenticated remote code execution. Upgrade to PHP %2$s or newer as soon as possible, or ask your hosting provider to do so.', 'catcher24-connector'),
          esc_html($status['php_version']),
          esc_html($status['fixed_version'])
        );
        ?>
      </p>
      <p>
        <a class="button button-primary" href="<?php echo esc_url(admin_url('site-health.php')); ?>">
          <?php esc_html_e('View details in Site Health', 'catcher24-connector'); ?>
        </a>
        <a class="button" href="<?php echo esc_url($php2shell->get_confirm_url()); ?>">
          <?php esc_html_e('My host has patched this', 'catcher24-connector'); ?>
        </a>
      </p>
    </div>
    <?php
  }
}
