import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default function DashboardPage() {
  const toast = useRef<Toast>(null);
  const { apiUrl, targetId, siteHostname } = catcher24WordpressConnector;

  // State
  const [loading, setLoading] = useState(true);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [activeScans, setActiveScans] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [rootDomains, setRootDomains] = useState<any[]>([]);

  const fetchDashboardData = useCallback(async () => {
    if (!targetId) return;
    try {
      const [vulnRes, scansRes, activeScansRes, certsRes, domainsRes] = await Promise.all([
        fetch(`${apiUrl}/targets/${targetId}/vulnerabilities?pageSize=500`).then((r) => r.json()),
        fetch(`${apiUrl}/targets/${targetId}/scans?orderBy=startedAt%20desc&pageSize=5`).then((r) => r.json()),
        fetch(`${apiUrl}/targets/${targetId}/scans?filter=status=running`).then((r) => r.json()),
        fetch(`${apiUrl}/targets/${targetId}/certificates?pageSize=5`).then((r) => r.json()),
        fetch(`${apiUrl}/targets/${targetId}/rootDomains?pageSize=5`).then((r) => r.json()),
      ]);

      setVulnerabilities(vulnRes.items || []);
      setRecentScans(scansRes.items || []);
      setActiveScans(activeScansRes.items || []);
      setCertificates(certsRes.items || []);
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

  // Derived calculations
  const severityCounts = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    vulnerabilities.forEach((v) => {
      if (v.severity === 4) counts.Critical++;
      if (v.severity === 3) counts.High++;
      if (v.severity === 2) counts.Medium++;
      if (v.severity === 1) counts.Low++;
    });
    return counts;
  }, [vulnerabilities]);

  const stats = [
    { label: "Critical", value: severityCounts.Critical, color: "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300" },
    { label: "High", value: severityCounts.High, color: "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300" },
    { label: "Medium", value: severityCounts.Medium, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300" },
    { label: "Low", value: severityCounts.Low, color: "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[400px]">
        <i className="pi pi-spin pi-spinner text-4xl text-primary" />
      </div>
    );
  }

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
      <div className="flex-col md:flex dark:bg-gray-900 min-h-screen">
        <div className="flex-1 space-y-6 pt-6 mb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl dark:text-white font-bold tracking-tight">Vulnerability Overview</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Target: <strong>{siteHostname}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                label="View Full Insights on Catcher24"
                icon="pi pi-external-link"
                className="p-button-outlined bg-white dark:bg-gray-800"
                onClick={() => window.open(`https://catcher24.com/dashboard/organization/targets`, "_blank")}
              />
            </div>
          </div>

          {/* Active Scans Banner */}
          {activeScans.length > 0 && (
            <Card title="Active Scans Running" className="shadow-sm border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              {activeScans.map((scan) => (
                <div key={scan.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1 text-blue-900 dark:text-blue-100 font-medium">
                    <span>Scan Strategy: {scan.scanStrategyName || "Default"}</span>
                    <span>{Math.round(scan.progress)}%</span>
                  </div>
                  <ProgressBar value={Math.round(scan.progress)} showValue={false} style={{ height: '8px' }} color="#3b82f6" />
                </div>
              ))}
            </Card>
          )}

          {/* Severity Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Card key={i} className="shadow-sm border border-surface-200 dark:border-surface-700">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}>
                    <i className="pi pi-shield"></i>
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold dark:text-white">{stat.value}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed Lists */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Recent Scans" className="shadow-sm border border-surface-200 dark:border-surface-700 h-full">
              <DataTable value={recentScans} emptyMessage="No recent scans found" stripedRows size="small" rows={5}>
                <Column field="scanStrategyName" header="Strategy" />
                <Column header="Status" body={renderScanStatus} />
                <Column header="Started At" body={(rowData) => formatDate(rowData, "startedAt")} />
              </DataTable>
            </Card>

            <div className="flex flex-col gap-6">
              <Card title="Certificates" className="shadow-sm border border-surface-200 dark:border-surface-700">
                <DataTable value={certificates} emptyMessage="No certificates found" stripedRows size="small" rows={3}>
                  <Column field="subject" header="Subject" />
                  <Column field="issuer" header="Issuer" />
                  <Column header="Valid To" body={(rowData) => formatDate(rowData, "validTo")} />
                </DataTable>
              </Card>

              <Card title="DNS Records" className="shadow-sm border border-surface-200 dark:border-surface-700">
                <DataTable value={rootDomains} emptyMessage="No DNS records found" stripedRows size="small" rows={3}>
                  <Column field="domain" header="Domain" />
                  <Column field="recordType" header="Type" />
                  <Column field="value" header="Value" />
                </DataTable>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
