import { useEffect, useState, useRef, useCallback } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import { TargetModel, CertificateModel, DnsRootDomainModel, TargetPortModel, DnsAdviceModel } from "../../models/shared";
import { DnsFlattener } from "../../utils/dns-flattener";
import { TargetsScanProgressBar } from "../../components/TargetsScanProgressBar";
import { DashboardSeverityMetrics } from "../../components/DashboardSeverityMetrics";
import { TopVulnerabilitiesTable } from "../../components/TopVulnerabilitiesTable";
import { DnsRecordsTable } from "../../components/DnsRecordsTable";
import { CertificatesTable } from "../../components/CertificatesTable";
import { RecentScansTable } from "../../components/RecentScansTable";
import { formatDate, formatDuration, topologicalSortRunners } from "../../utils/formatters";

export default function DashboardPage() {
  const toast = useRef<Toast>(null);
  const { apiUrl, targetId, dashboardUrl, organization } = catcher24WordpressConnector;

  // State
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<TargetModel | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [activeScans, setActiveScans] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<CertificateModel[]>([]);
  const [targetPorts, setTargetPorts] = useState<TargetPortModel[]>([]);
  const [flattenedDnsRecords, setFlattenedDnsRecords] = useState<any[]>([]);
  const [dnsAdvices, setDnsAdvices] = useState<DnsAdviceModel[]>([]);

  const getApiUrl = (endpoint: string, params: Record<any, any> = {}) => {
    // 1. Create a full URL object (apiUrl should be the base from localized data)
    const url = new URL(`${apiUrl}${endpoint}`);

    // 2. Use the searchParams interface to add filters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.set(key, params[key]);
      }
    });

    // 3. .toString() provides a fully encoded absolute URL
    return url.toString();
  };

  const fetchDashboardData = useCallback(async () => {
    if (!targetId) return;
    try {
      const [targetRes, vulnRes, scansRes, activeScansRes, certsRes, domainsRes, portsRes] = await Promise.all([
        fetch(getApiUrl(`/targets/${targetId}`)).then((r) => r.json()),

        fetch(getApiUrl(`/targets/${targetId}/vulnerabilities`, {
          pageSize: 500
        })).then((r) => r.json()),

        fetch(getApiUrl(`/targets/${targetId}/scans`, {
          orderBy: 'startedAt desc',
          pageSize: 5
        })).then((r) => r.json()),

        fetch(getApiUrl(`/targets/${targetId}/scans`, {
          filter: 'endedAt='
        })).then((r) => r.json()),

        fetch(getApiUrl(`/targets/${targetId}/certificates`, {
          pageSize: 5
        })).then((r) => r.json()),

        fetch(getApiUrl(`/targets/${targetId}/rootDomains`, {
          pageSize: 5
        })).then((r) => r.json()),

        fetch(getApiUrl(`/targets/${targetId}/ports`, {
          pageSize: 50
        })).then((r) => r.json()),
      ]);

      setTarget(targetRes);
      setVulnerabilities(vulnRes.items || []);
      setRecentScans(scansRes.items || []);
      setActiveScans(activeScansRes.items || []);
      setCertificates(certsRes.items || []);
      setTargetPorts(portsRes.items || []);
      
      const rootDoms = domainsRes.items || [];
      
      let allRecords: any[] = [];
      let allAdvices = new Map<string, DnsAdviceModel>();

      rootDoms.forEach((rd: DnsRootDomainModel) => {
        const flat = DnsFlattener.flattenRecords(rd);
        if (flat.aRecords) allRecords = allRecords.concat(flat.aRecords.map(r => ({ type: 'A', ...r })));
        if (flat.aaaaRecords) allRecords = allRecords.concat(flat.aaaaRecords.map(r => ({ type: 'AAAA', ...r })));
        if (flat.cnameRecords) allRecords = allRecords.concat(flat.cnameRecords.map(r => ({ type: 'CNAME', ...r })));
        
        if (flat.mxRecords) {
          allRecords = allRecords.concat(flat.mxRecords.map(r => ({ type: 'MX', ...r })));
          flat.mxRecords.forEach(r => {
            if (r.advice && Array.isArray(r.advice)) {
              r.advice.forEach((adv: DnsAdviceModel) => allAdvices.set(adv.advice, adv));
            }
          });
        }
        
        if (flat.txtRecords) {
           flat.txtRecords.forEach(grp => {
             allRecords = allRecords.concat(grp.records.map((r: any) => ({ type: `TXT (${grp.type})`, ...r })));
             grp.records.forEach((r: any) => {
               if (r.advice && Array.isArray(r.advice)) {
                 r.advice.forEach((adv: DnsAdviceModel) => allAdvices.set(adv.advice, adv));
               }
             });
           });
        }
      });
      setFlattenedDnsRecords(allRecords);
      setDnsAdvices(Array.from(allAdvices.values()).sort((a, b) => b.severity - a.severity));
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, targetId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!targetId) return;

    let newConnection: HubConnection | null = null;
    let isCancelled = false;

    const setupSignalR = async () => {
      try {
        const res = await fetch(`${apiUrl}/hub/public/negotiate`, { method: "POST" });
        if (!res.ok) return;

        const data = await res.json();

        if (isCancelled) return;

        newConnection = new HubConnectionBuilder()
          .withUrl(data.url, {
            accessTokenFactory: () => data.accessToken,
          })
          .configureLogging(LogLevel.Warning)
          .withAutomaticReconnect()
          .build();

        newConnection.on("ScanCreated", fetchDashboardData);
        newConnection.on("ScanStarted", fetchDashboardData);
        newConnection.on("ScanUpdated", fetchDashboardData);
        newConnection.on("ScanCompleted", fetchDashboardData);
        newConnection.on("ScanRunnerCompleted", fetchDashboardData);
        newConnection.on("ScanFailed", fetchDashboardData);

        await newConnection.start();
      } catch (e) {
        console.error("SignalR Connection Error: ", e);
      }
    };

    setupSignalR();

    return () => {
      isCancelled = true;
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [apiUrl, targetId, fetchDashboardData]);

  if (loading || !target) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[400px]">
        <i className="pi pi-spin pi-spinner text-4xl text-primary" />
      </div>
    );
  }

  const renderTargetBadges = () => {
    if (target.mostSevereVulnerability || target.severity) {
      if (target.severity.critical > 0) return <div className="rounded bg-severity-critical-light px-2 py-1 font-bold text-severity-critical-dark">Critical</div>;
      if (target.severity.high > 0) return <div className="rounded bg-severity-high-light px-2 py-1 font-bold text-severity-high-dark">High</div>;
      if (target.severity.medium > 0) return <div className="rounded bg-severity-medium-light px-2 py-1 font-bold text-severity-medium-dark">Medium</div>;
      if (target.severity.low > 0) return <div className="rounded bg-severity-low-light px-2 py-1 font-bold text-severity-low-dark">Low</div>;
      return <div className="rounded bg-green-100 px-2 py-1 font-bold text-green-800">No vulnerabilities</div>;
    }
    return <div className="rounded bg-gray-200 px-2 py-1 font-bold text-gray-800">Not scanned</div>;
  };

  const renderCollectorsInline = (rowData: any) => {
    if (!rowData.runners || rowData.runners.length === 0) return "N/A";
    const sortedRunners = topologicalSortRunners(rowData.runners);

    return (
      <div className="flex flex-col gap-1 w-full min-w-[200px]">
        {sortedRunners.map((r: any, idx: number) => {
          const name = r.configuration?.displayName || r.specializationDisplayName || `Collector Type ${r.collectorType}`;
          const isLast = idx === rowData.runners.length - 1;
          return (
            <div key={idx} className={`flex justify-between items-center text-xs py-1 ${!isLast ? 'border-b border-surface-200' : ''}`}>
              <div className="flex items-center">
                <span className="truncate mr-2 max-w-[150px]" title={name}>{name}</span>
              </div>
              <span className="bg-surface-100 text-surface-600 px-1.5 py-0.5 rounded text-[10px] font-medium border border-surface-200 uppercase">
                {r.collectorStatus}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex-col md:flex min-h-screen">
        <div className="flex-1 space-y-6 pt-6 mb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-row items-center gap-4 flex-wrap mb-2">
                <div className="flex gap-2 items-center">
                  {renderTargetBadges()}
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">{target.preferredDisplayName}</h2>
              <hr className="text-surface-200 mt-4 mb-2" />
              <div className="flex flex-col gap-1">
                <span className="text-md font-bold text-gray-700">Ports</span>
                <div className="flex flex-wrap gap-1 text-sm mt-1">
                  {targetPorts.length === 0 ? (
                    <span className="text-gray-500">No ports detected</span>
                  ) : (
                    targetPorts.map((port, idx) => (
                      <span key={idx} className="inline-block px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-700">
                        {port.value}/{port.type === 0 ? "TCP" : "UDP"}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <p className="text-gray-500 mt-1">
                Target: <strong>{target.ip || target.hostname}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                label="View Full Insights on Catcher24"
                icon="pi pi-external-link"
                className="p-button-outlined"
                onClick={() => {
                  const baseUrl = dashboardUrl.replace(/\/$/, "");
                  window.open(`${baseUrl}/org/${organization.identifier}/targets/${target.id}`, "_blank");
                }}
              />
            </div>
          </div>

          <DashboardSeverityMetrics severity={target.severity} />

          {/* Active Scans Banner */}
          {activeScans.length > 0 && (
            <Card title="Active Scans Running" className="shadow-sm border border-blue-200 bg-blue-50">
              {activeScans.map((scan) => (
                <div key={scan.id} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-center text-sm mb-2 text-blue-900 font-medium pb-2 border-b border-blue-100">
                    <div>
                      <span className="font-bold mr-2 text-base">{scan.scanStrategyName || "Default"}</span>
                      <span className="text-gray-500 text-xs">Started: {formatDate(scan.startedAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <TargetsScanProgressBar scan={scan} />
                  </div>
                </div>
              ))}
            </Card>
          )}



          {/* Detailed Lists */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Top Vulnerabilities" className="shadow-sm border border-surface-200 h-full">
              <TopVulnerabilitiesTable vulnerabilities={vulnerabilities} />
            </Card>

            <Card title="Recent Scans" className="shadow-sm border border-surface-200 h-full">
              <RecentScansTable 
                recentScans={recentScans} 
                formatDate={formatDate} 
                formatDuration={formatDuration} 
                renderCollectorsInline={renderCollectorsInline} 
              />
            </Card>

            <Card title="Certificates" className="shadow-sm border border-surface-200 ">
              <CertificatesTable certificates={certificates} formatDate={formatDate} />
            </Card>

            <Card title="DNS Records" className="shadow-sm border border-surface-200 ">
              <DnsRecordsTable dnsAdvices={dnsAdvices} flattenedDnsRecords={flattenedDnsRecords} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
