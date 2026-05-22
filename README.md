# 🛡️ Catcher24 Connector

[![License](https://img.shields.io/badge/license-GPLv2%20or%20later-orange.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
[![WordPress](https://img.shields.io/badge/WordPress-6.5%2B-blue.svg)](https://wordpress.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://php.net/)

The **Catcher24 Connector** is a secure, ultra-lightweight WordPress plugin designed to seamlessly connect your site to the external **Catcher24** cybersecurity cloud platform. 

By offloading all resource-heavy vulnerability scanning, threat analysis, and security auditing to the Catcher24 cloud infrastructure, you can audit your overall security posture.
---

## ✨ Features

- **Remote Audits:** Trigger deep, non-intrusive security scans on-demand.
- **Real-Time Tracking:** Watch scan progress directly in your WordPress UI via a lightweight WebSocket connection.
- **Security Dashboard:** View high-level scan reports, CVE counts, and vulnerability overviews right from the WordPress admin panel.
- **Zero Server Overhead:** Actively scan comment forms, public endpoints, and plugin configurations without draining server CPU or memory.
- **Privacy First:** Absolutely no background tracking, no visitor tracking, and zero continuous data streaming.

---

## 🛠️ Local Development

The admin interface of this plugin is built as a state-of-the-art Single Page Application (SPA) using **React**, **TypeScript**, and **TailwindCSS**, managed via **pnpm** and built with **Vite**.

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 20.0.0)
- [pnpm](https://pnpm.io/) (>= 10.0.0)

### 1. Installation

First, clone the repository and install all development dependencies:

```bash
pnpm install
```

### 2. Run the Development Server

For the absolute best local workflow (which launches the React app alongside an automated **WordPress Playground** environment with pre-configured settings and Xdebug support):

```bash
pnpm run dev:server
```
*Note: This utilizes a standard WordPress Playground setup so you don't even need a local Apache/MySQL server!*

### 3. Production Build

To clean, compile, and bundle minified assets for directory distribution:

```bash
pnpm run build
```

---

## 🎨 Storybook

We use **Storybook** to develop, document, and test our UI components in isolation. It includes curated CSS tokens, mockup assets, and component mock states to let you inspect the premium UI without setting up a full server database.

### Run Storybook

To start the local Storybook interface:

```bash
pnpm run storybook
```

Once running, you can view the component explorer and interactive UI playground by opening your browser at:

👉 **[http://localhost:6006](http://localhost:6006)**

### Build Storybook (Static Output)

To build the static Storybook documentation pages:

```bash
pnpm run build-storybook
```
