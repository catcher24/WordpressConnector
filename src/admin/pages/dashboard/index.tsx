import { useEffect, useState, useRef, useCallback } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import { TargetModel, CertificateModel, DnsRootDomainModel, TargetPortModel } from "../../models/shared";
import { DnsFlattener } from "../../utils/dns-flattener";

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
      rootDoms.forEach((rd: DnsRootDomainModel) => {
        const flat = DnsFlattener.flattenRecords(rd);
        if (flat.aRecords) allRecords = allRecords.concat(flat.aRecords.map(r => ({ type: 'A', ...r })));
        if (flat.aaaaRecords) allRecords = allRecords.concat(flat.aaaaRecords.map(r => ({ type: 'AAAA', ...r })));
        if (flat.cnameRecords) allRecords = allRecords.concat(flat.cnameRecords.map(r => ({ type: 'CNAME', ...r })));
        if (flat.mxRecords) allRecords = allRecords.concat(flat.mxRecords.map(r => ({ type: 'MX', ...r })));
        if (flat.txtRecords) {
           flat.txtRecords.forEach(grp => {
             allRecords = allRecords.concat(grp.records.map((r: any) => ({ type: `TXT (${grp.type})`, ...r })));
           });
        }
      });
      setFlattenedDnsRecords(allRecords);
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

  const renderScanStatus = (rowData: any) => {
    switch (rowData.status) {
      case 0: return <Tag severity="info" value="Created" />;
      case 1: return <Tag severity="warning" value="Running" />;
      case 2: return <Tag severity="success" value="Completed" />;
      case 3: return <Tag severity="danger" value="Failed" />;
      case 4: return <Tag severity="danger" value="Cancelled" />;
      default: return <Tag value="Unknown" />;
    }
  };

  const formatDate = (rowData: any, field: string) => {
    return rowData[field] ? new Date(rowData[field]).toLocaleString() : "N/A";
  };

  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex-col md:flex min-h-screen">
        <div className="flex-1 space-y-6 pt-6 mb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-row items-center gap-2 flex-wrap mb-2">
                {renderTargetBadges()}
                <Tag severity="info" value={target.type === 0 ? "Web" : "Network"} className="px-2 py-1" />
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
                Target: <strong>{target.ip ?? target.hostname}</strong>
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

          {/* Active Scans Banner */}
          {activeScans.length > 0 && (
            <Card title="Active Scans Running" className="shadow-sm border border-blue-200 bg-blue-50 ">
              {activeScans.map((scan) => (
                <div key={scan.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1 text-blue-900 font-medium">
                    <span>Scan Strategy: {scan.scanStrategyName || "Default"}</span>
                    <span>{Math.round(scan.progress)}%</span>
                  </div>
                  <ProgressBar value={Math.round(scan.progress)} showValue={false} style={{ height: '8px' }} color="#3b82f6" />
                </div>
              ))}
            </Card>
          )}



          {/* Detailed Lists */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Top Vulnerabilities" className="shadow-sm border border-surface-200 h-full">
              <DataTable value={vulnerabilities} emptyMessage="No recent vulnerabilities found" stripedRows size="small" rows={5}>
                <Column header="Name" field="displayName" />
                <Column header="Severity" field="severity" />
              </DataTable>
            </Card>

            <Card title="Recent Scans" className="shadow-sm border border-surface-200 h-full">
              <DataTable value={recentScans} emptyMessage="No recent scans found" stripedRows size="small" rows={5}>
                <Column field="scanStrategyName" header="Strategy" />
                <Column header="Status" body={renderScanStatus} />
                <Column header="Started At" body={(rowData) => formatDate(rowData, "startedAt")} />
              </DataTable>
            </Card>

            <Card title="Certificates" className="shadow-sm border border-surface-200 ">
              <DataTable value={certificates} emptyMessage="No certificates found" stripedRows size="small" rows={3}>
                <Column field="commonName" header="Name" />
                <Column field="issuer" header="Issuer" />
                <Column header="Valid To" body={(rowData) => formatDate(rowData, "validTo")} />
              </DataTable>
            </Card>

            <Card title="DNS Records" className="shadow-sm border border-surface-200 ">
              <DataTable value={flattenedDnsRecords} emptyMessage="No DNS records found" stripedRows size="small" rows={3}>
                <Column field="name" header="Name / Exchange" body={r => r.name || r.exchange || r.mName || 'N/A'} />
                <Column field="type" header="Type" />
                <Column field="value" header="Value / Address" body={r => r.value || r.address || r.addressIpv6 || 'N/A'} />
              </DataTable>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
