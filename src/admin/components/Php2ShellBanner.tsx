import React from "react";

/**
 * Warns admins when the server runs a PHP version vulnerable to php2shell
 * (CVE-2026-109618 / CVE-2026-109619). The data is only present when the banner should show.
 */
export const Php2ShellBanner: React.FC = () => {
  const php2shell = catcher24Connector.php2shell;

  if (!php2shell) return null;

  return (
    <div className="mb-6 block rounded-md border p-4 bg-severity-critical-lighter border-severity-critical-dark text-severity-critical-darker">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-current">
            Critical 9.2
          </span>
          <h3 className="text-base font-medium">Your PHP version is vulnerable to php2shell</h3>
        </div>
        <p className="text-sm">
          PHP {php2shell.phpVersion} is affected by CVE-2026-109618 and CVE-2026-109619, two critical
          vulnerabilities that may allow unauthenticated remote code execution. Upgrade to
          PHP {php2shell.fixedVersion} or newer as soon as possible, or ask your hosting provider to do so.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <a href={php2shell.siteHealthUrl} className="underline">
            View details in Site Health
          </a>
          <a href={php2shell.confirmUrl} className="underline">
            My host has patched this
          </a>
          <a href={php2shell.advisoryUrl} target="_blank" rel="noopener noreferrer" className="underline">
            CERT-EU advisory
          </a>
        </div>
      </div>
    </div>
  );
};
