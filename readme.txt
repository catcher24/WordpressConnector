=== Catcher24 WP Connector ===
Contributors: catcher24
Tags: security, vulnerability scanner, cybersecurity, malware scanner, firewall
Requires at least: 6.5
Tested up to: 7.0
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Connect your WordPress site to Catcher24 for automated vulnerability scanning, real-time threat alerts, and continuous security monitoring.

== Description ==

The **Catcher24 WP Connector** is a powerful, behind-the-scenes integration tool designed to bridge the gap between your WordPress installation and the robust Catcher24 cybersecurity platform.

With cybersecurity threats constantly evolving, managing security purely within your WordPress admin dashboard is no longer enough. This plugin acts as a secure, lightweight conduit that allows the Catcher24 dashboard to:

* **Automate Vulnerability Scanning**: Perform deep, non-intrusive scans of your WordPress core, plugins, themes, and server environment.
* **Real-Time Threat Intelligence**: Sync telemetry data with Catcher24 to identify emerging threats before they impact your site.
* **Continuous Monitoring**: Keep an eye on unauthorized file changes, suspicious login attempts, and known vulnerabilities (CVEs).
* **Centralized Management**: Manage the security posture of multiple WordPress sites from a single, unified Catcher24 dashboard.

**Note**: This plugin requires an active Catcher24 account to function. The plugin itself provides the connection interface and telemetry hooks, while the heavy lifting of scanning and analysis is safely offloaded to the Catcher24 cloud.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/catcher24-wordpress-connector` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Navigate to the **Catcher24 Setup** menu in your WordPress admin dashboard.
4. Follow the setup wizard to securely connect your site to your Catcher24 organization and assign target slots.

== Frequently Asked Questions ==

= Do I need a Catcher24 account to use this plugin? =
Yes. This plugin connects your WordPress site to the Catcher24 dashboard. You must have an active organization and available target slots in Catcher24.

= Will this plugin slow down my site? =
No. The Catcher24 Wordpress Connector is built to be lightweight. All resource-intensive tasks, such as vulnerability scanning and malware analysis, are processed remotely on the Catcher24 infrastructure.

= Is my data secure? =
Absolutely. All communication between your WordPress site and the Catcher24 platform is encrypted. We adhere to strict data privacy guidelines, including GDPR compliance.

== Changelog ==

= 1.0.0 =
* Initial release of the Catcher24 Wordpress Connector.
* Added secure setup wizard and organization binding.
* Integrated target assignment and synchronization.
* Included automated telemetry hooks.
