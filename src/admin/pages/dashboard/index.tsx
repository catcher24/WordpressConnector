import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import { TargetModel, CertificateModel, DnsRootDomainModel, TargetPortModel } from "../../models/shared";
import { DnsFlattener } from "../../utils/dns-flattener";
import { TargetsScanProgressBar } from "../../components/TargetsScanProgressBar";
import { DashboardSeverityMetrics } from "../../components/DashboardSeverityMetrics";
import { TopVulnerabilitiesTable } from "../../components/TopVulnerabilitiesTable";
import { DnsRecordsTable } from "../../components/DnsRecordsTable";
import { CertificatesTable } from "../../components/CertificatesTable";
import { RecentScansTable } from "../../components/RecentScansTable";
import { DashboardHeader } from "../../components/DashboardHeader";
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
  const [rootDomains, setRootDomains] = useState<DnsRootDomainModel[]>([]);
  const [showFullDns, setShowFullDns] = useState(false);

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
      setRootDomains(domainsRes.items || []);
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

  const groupedDnsRecords = useMemo(() => {
    if (!rootDomains || rootDomains.length === 0) return null;

    const combined: any = {
      aRecords: [],
      aaaaRecords: [],
      txtRecords: [],
      cnameRecords: [],
      mxRecords: [],
      srvRecords: [],
      nameServers: [],
      soaRecords: [],
      dnskeyRecords: [],
      dsRecords: [],
      nsecRecords: [],
      nsec3Records: [],
    };

    rootDomains.forEach(rd => {
      const flat = DnsFlattener.flattenRecords(rd, showFullDns ? undefined : target?.hostname);
      
      combined.aRecords.push(...flat.aRecords);
      combined.aaaaRecords.push(...flat.aaaaRecords);
      combined.cnameRecords.push(...flat.cnameRecords);
      combined.mxRecords.push(...flat.mxRecords);
      combined.srvRecords.push(...flat.srvRecords);
      combined.nameServers.push(...flat.nameServers);
      combined.soaRecords.push(...flat.soaRecords);
      combined.dnskeyRecords.push(...flat.dnskeyRecords);
      combined.dsRecords.push(...flat.dsRecords);
      combined.nsecRecords.push(...flat.nsecRecords);
      combined.nsec3Records.push(...flat.nsec3Records);

      flat.txtRecords.forEach(grp => {
        const existing = combined.txtRecords.find((t: any) => t.type === grp.type);
        if (existing) {
          existing.records.push(...grp.records);
        } else {
          combined.txtRecords.push({ ...grp });
        }
      });
    });

    return combined;
  }, [rootDomains, showFullDns, target]);

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

  if (loading || !target) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[400px]">
        <i className="pi pi-spin pi-spinner text-4xl text-primary" />
      </div>
    );
  }



  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex-col md:flex min-h-screen">
        <div className="flex-1 space-y-6 pt-6 mb-12">
          <DashboardHeader 
            target={target}
            targetPorts={targetPorts}
            formatDate={formatDate}
            onViewFullInsights={() => {
              const baseUrl = dashboardUrl.replace(/\/$/, "");
              window.open(`${baseUrl}/org/${organization.identifier}/targets/${target.id}`, "_blank");
            }}
          />

          {/*
          <DashboardSeverityMetrics severity={target.severity} />
          */}

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
          <Card title="Top Vulnerabilities" className="shadow-sm border border-surface-200 h-full">
            <TopVulnerabilitiesTable vulnerabilities={vulnerabilities} />
          </Card>

          <Card title="Certificates" className="shadow-sm border border-surface-200 ">
            <CertificatesTable certificates={certificates} formatDate={formatDate} />
          </Card>

          <Card title="DNS Records" className="shadow-sm border border-surface-200 ">
            <DnsRecordsTable 
              groupedRecords={groupedDnsRecords} 
              showFullDns={showFullDns}
              setShowFullDns={setShowFullDns}
              isSubdomain={rootDomains.some(rd => rd.value !== target?.hostname)}
            />
          </Card>

          <Card title="Recent Scans" className="shadow-sm border border-surface-200 h-full">
            <RecentScansTable 
              recentScans={recentScans} 
              formatDate={formatDate} 
              formatDuration={formatDuration} 
              renderCollectorsInline={renderCollectorsInline} 
            />
          </Card>
        </div>
      </div>
    </>
  );
}
