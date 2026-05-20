=== Catcher24 Connector ===
Contributors: catcher24
Tags: security, vulnerability scanner, cybersecurity, malware scanner, firewall
Requires at least: 6.5
Tested up to: 7.0
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Connect your WordPress site to Catcher24 for automated vulnerability scanning and security analysis with zero performance impact.

== Description ==

The **Catcher24 Connector** is a secure, lightweight integration tool designed to bridge the gap between your WordPress installation and the Catcher24 cybersecurity platform.

Managing security purely within your WordPress admin dashboard drains server resources and limits your visibility. This plugin solves that by acting as a secure conduit, offloading the heavy lifting of security analysis entirely to the Catcher24 cloud infrastructure.

**How It Works:**

* **On-Demand Scanning:** Start a deep, non-intrusive scan of your WordPress environment directly from your dashboard. The scan is executed by the Catcher24 platform against the specific target you created for your site.
* **Live Progress Tracking:** While the scan is running remotely, a lightweight WebSocket connection provides real-time progress updates directly in your WordPress UI.
* **Direct Results:** Once the scan is complete, the plugin pulls a high-level overview of the results straight from the Catcher24 API. No continuous background communication is needed.
* **Deep Analysis:** You can easily jump from the plugin into the Catcher24 platform to view the full, detailed results of any vulnerabilities, CVEs, or security threats found.

**Note:** This plugin requires an active Catcher24 account. The plugin initiates the scans and fetches the results, while all actual scanning operations occur safely and efficiently on the Catcher24 cloud.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/catcher24-connector` directory, or install the plugin through the WordPress 'Plugins' screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Navigate to the **Catcher24 Setup** menu in your WordPress admin dashboard.
4. Follow the setup wizard to securely connect your site to your Catcher24 organization and assign your target slot.

== Frequently Asked Questions ==

= Do I need a Catcher24 account to use this plugin? =
Yes. This plugin connects your WordPress site to the Catcher24 dashboard. You must have an active organization and available target slots in Catcher24 to utilize the scanning features.

= Will this plugin slow down my site? =
No. The Catcher24 Connector is built to be extremely lightweight. All resource-intensive tasks, such as vulnerability scanning and malware analysis, are processed remotely on the Catcher24 infrastructure. The plugin only communicates with our API to start a scan and pull the results, meaning zero impact on your server performance or page load speeds.

= Can I use this alongside other security plugins (like Wordfence or Sucuri)? =
Yes. Catcher24 Connector acts as an external auditor for your overall security posture and generally plays well with on-site firewalls and other security plugins.

= What happens when a vulnerability is detected? =
When Catcher24 identifies a vulnerability, you will receive an overview of the results directly in the plugin UI. You can view the full vulnerability details and mitigation steps in the Catcher24 platform.

= Will the scanner create test data or comments on my site? =
Yes. During the active scanning process, the Catcher24 infrastructure evaluates every discoverable endpoint on your site to test for vulnerabilities. Because comment forms are endpoints, the scanner may submit test comments to ensure those inputs are secure. You will see these test comments in your moderation queue, which you can safely review and delete.

= How do I disconnect my site? =
You can disconnect the connection entirely at any time simply by deleting the plugin from your WordPress installation.

= How do I delete separate targets or my entire account? =
Individual target slots can be managed and deleted directly inside your Catcher24 cloud dashboard. If you wish to close your entire account, you can also initiate full account deletion from the dashboard settings.

= Is my data secure? =
Absolutely. All communication between your WordPress site and the Catcher24 platform is encrypted. The plugin only communicates when initiating a scan or pulling results; there is no continuous data streaming. We adhere to strict data privacy guidelines, including GDPR compliance.

== Support ==

If you encounter any issues connecting your site to Catcher24 or running a scan, we are here to help.

* **Documentation:** Visit our full documentation at [our help desk](https://help.catcher24.net/) for detailed setup guides and troubleshooting.

== Privacy & Data Usage ==

Transparency and data security are our top priorities. Because the Catcher24 Connector integrates with an external cloud service, here is exactly how your data is handled:

* **No Background Tracking:** The plugin does not continuously track user activity, visitor data, or stream telemetry in the background.
* **On-Demand Execution:** Communication with the Catcher24 API only occurs when you explicitly initiate a scan from your WordPress dashboard, or when the plugin fetches the results of that scan.
* **Scan Data:** During an active scan, the Catcher24 platform analyzes your site's public-facing endpoints and structural data (like plugin versions and core files) to identify vulnerabilities.
* **Data Storage:** Scan results and vulnerability reports are stored securely in your Catcher24 cloud account.

== Screenshots ==

1. The secure setup wizard connecting your WordPress site to your Catcher24 organization.
2. A vulnerability scan in progress, featuring real-time progress tracking.
3. The high-level scan results overview displayed directly inside your WordPress dashboard.

== Changelog ==

= 1.0.0 =
* Initial release of the Catcher24 Connector.
* Added secure setup wizard and organization binding.
* Integrated on-demand scanning with real-time WebSocket progress reporting.
* Added API integration for fetching scan results overview.
