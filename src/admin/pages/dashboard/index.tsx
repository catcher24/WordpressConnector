import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Toast } from "primereact/toast";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import {
  TargetModel,
  CertificateModel,
  DnsRootDomainModel,
  TargetPortModel,
  ScanModel,
  ScannerModel,
  CollectorGroupModel,
  CollectorModel,
  OrganizationModel,
} from "../../models";
import { TargetsScanProgressBar } from "../../components/TargetsScanProgressBar";
import { TopVulnerabilitiesTable } from "../../components/TopVulnerabilitiesTable";
import { DnsRecordsTable } from "../../components/DnsRecordsTable";
import { CertificatesTable } from "../../components/CertificatesTable";
import { RecentScansTable } from "../../components/RecentScansTable";
import { DashboardHeader } from "../../components/DashboardHeader";
import { Panel } from "primereact/panel";
import { DnsFlattener, formatDate, getApiUrl } from "../../helpers";
import { useOrganizationCapabilities } from "../../hooks/useOrganizationCapabilities";
import { TargetType } from "../../enums";
import { apiFetch } from "../../utils/api-fetch";

export default function DashboardPage() {
  const toast = useRef<Toast>(null);
  const { apiUrl, targetId, dashboardUrl, organization } = catcher24Connector;

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<TargetModel | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<ScanModel[]>([]);
  const [activeScans, setActiveScans] = useState<ScanModel[]>([]);
  const [certificates, setCertificates] = useState<CertificateModel[]>([]);
  const [targetPorts, setTargetPorts] = useState<TargetPortModel[]>([]);
  const [rootDomains, setRootDomains] = useState<DnsRootDomainModel[]>([]);
  const [showFullDns, setShowFullDns] = useState(false);
  const [isStartingScan, setIsStartingScan] = useState(false);
  const [isCancelingScan, setIsCancelingScan] = useState(false);

  // Scanner / collector lookup tables
  const [scanners, setScanners] = useState<ScannerModel[]>([]);
  const [collectorGroups, setCollectorGroups] = useState<CollectorGroupModel[]>([]);
  const [collectors, setCollectors] = useState<CollectorModel[]>([]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dashboardDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const orgModel = useMemo(() => OrganizationModel.asOrganizationModel(organization), [organization]);
  const capabilities = useOrganizationCapabilities(orgModel);

  const isDnsExcluded = capabilities.isCollectorExcluded(
    "38A8DF2C-0993-425F-AC80-90C0C6FF4EE9",
    target?.type || TargetType.WebApplication
  );
  const isCertificatesExcluded = capabilities.isCollectorExcluded(
    "3BE982B9-D0CA-4D0E-96D2-FBD012B4CA10",
    target?.type || TargetType.WebApplication
  );

  const onUpgrade = () => {
    const baseUrl = dashboardUrl.replace(/\/$/, "");
    window.open(
      `${baseUrl}/org/${organization.identifier}/organization/subscription`,
      "_blank",
    );
  };
  const scannerMap = useMemo<Map<string, ScannerModel>>(
    () => new Map(scanners.map((s) => [s.id, s])),
    [scanners]
  );

  const collectorGroupMap = useMemo<Map<string, CollectorGroupModel>>(
    () => new Map(collectorGroups.map((cg) => [cg.id, cg])),
    [collectorGroups]
  );

  const collectorMap = useMemo<Map<string, CollectorModel>>(
    () => new Map(collectors.map((c) => [c.id, c])),
    [collectors]
  );

  // -------------------------------------------------------------------------
  // Helper: resolve the human-readable scan name via the scanner lookup chain
  // scan.scannerId → ScannerModel → CollectorGroupModel.name
  // -------------------------------------------------------------------------
  const getScannerName = useCallback(
    (scan: ScanModel): string => {
      const scanner = scannerMap.get(scan.scannerId);
      if (!scanner) return "Unknown Scanner";
      return collectorGroupMap.get(scanner.collectorGroupId)?.name ?? "Unknown Group";
    },
    [scannerMap, collectorGroupMap]
  );

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  const fetchEndpoint = useCallback(async (path: string, queryParams?: any) => {
    const res = await apiFetch(getApiUrl(apiUrl, path, queryParams));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }, [apiUrl]);

  const fetchScansData = useCallback(async () => {
    if (!targetId) return;

    const results = await Promise.allSettled([
      fetchEndpoint(`/targets/${targetId}/scans`, {
        orderBy: "startedAt desc",
        pageSize: 5,
      }),
      fetchEndpoint(`/targets/${targetId}/scans`, { filter: "endedAt=" }),
    ]);

    const [scansRes, activeScansRes] = results;

    if (scansRes.status === "fulfilled") {
      setRecentScans(scansRes.value.items || []);
    }

    if (activeScansRes.status === "fulfilled") {
      setActiveScans(activeScansRes.value.items || []);
    }
  }, [targetId, fetchEndpoint]);

  const fetchScansDebounced = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchScansData();
    }, 1500);
  }, [fetchScansData]);

  const fetchDashboardDataWithRetry = useCallback(
    async (attempt = 1) => {
      if (!targetId) return;

      if (retryTimer.current) clearTimeout(retryTimer.current);

      const results = await Promise.allSettled([
        fetchEndpoint(`/targets/${targetId}`),
        fetchEndpoint(`/targets/${targetId}/vulnerabilities`, {
          pageSize: 500,
          orderBy: "severity desc, occurrences desc, name",
        }),
        fetchEndpoint(`/targets/${targetId}/scans`, {
          orderBy: "startedAt desc",
          pageSize: 5,
        }),
        fetchEndpoint(`/targets/${targetId}/scans`, { filter: "endedAt=" }),
        fetchEndpoint(`/targets/${targetId}/certificates`, { pageSize: 5 }),
        fetchEndpoint(`/targets/${targetId}/rootDomains`, { pageSize: 5 }),
        fetchEndpoint(`/targets/${targetId}/ports`, { pageSize: 50 }),
        fetchEndpoint("/scanners"),
        fetchEndpoint("/collectorGroups"),
        fetchEndpoint("/collectors"),
      ]);

      const [
        targetRes,
        vulnRes,
        scansRes,
        activeScansRes,
        certsRes,
        domainsRes,
        portsRes,
        scannersRes,
        collectorGroupsRes,
        collectorsRes,
      ] = results;

      if (targetRes.status === "fulfilled") setTarget(targetRes.value);
      if (vulnRes.status === "fulfilled") setVulnerabilities(vulnRes.value.items || []);
      if (scansRes.status === "fulfilled") setRecentScans(scansRes.value.items || []);
      if (activeScansRes.status === "fulfilled") setActiveScans(activeScansRes.value.items || []);
      if (certsRes.status === "fulfilled") setCertificates(certsRes.value.items || []);
      if (domainsRes.status === "fulfilled") setRootDomains(domainsRes.value.items || []);
      if (portsRes.status === "fulfilled") setTargetPorts(portsRes.value || []);
      if (scannersRes.status === "fulfilled") setScanners(scannersRes.value.items || []);
      if (collectorGroupsRes.status === "fulfilled") setCollectorGroups(collectorGroupsRes.value.items || []);
      if (collectorsRes.status === "fulfilled") setCollectors(collectorsRes.value.items || []);

      setLoading(false);

      const hasErrors = results.some((r) => r.status === "rejected");

      if (hasErrors) {
        const delay = Math.min(attempt * 2000, 15000);
        retryTimer.current = setTimeout(() => {
          fetchDashboardDataWithRetry(attempt + 1);
        }, delay);
      }
    },
    [targetId, fetchEndpoint],
  );

  const fetchDashboardDebounced = useCallback(() => {
    if (dashboardDebounceTimer.current)
      clearTimeout(dashboardDebounceTimer.current);

    dashboardDebounceTimer.current = setTimeout(() => {
      fetchDashboardDataWithRetry(1);
    }, 1500);
  }, [fetchDashboardDataWithRetry]);

  useEffect(() => {
    fetchDashboardDataWithRetry(1);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (dashboardDebounceTimer.current)
        clearTimeout(dashboardDebounceTimer.current);
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, [fetchDashboardDataWithRetry]);

  const onStartScan = async () => {
    if (!targetId || scanners.length === 0) return;
    setIsStartingScan(true);
    try {
      const configuredScannerId = target?.scannerConfigurations?.[0]?.scannerId || target?.scannerConfigurations?.[0]?.id;
      const scannerId = configuredScannerId || scanners[0].id;

      const res = await apiFetch(getApiUrl(apiUrl, `/targets/${targetId}/scanners/${scannerId}/start`), { method: "POST" });
      if (res.ok) {
        toast.current?.show({ severity: "success", summary: "Success", detail: "Scan started." });
        fetchScansData();
      } else {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to start scan." });
      }
    } catch (e) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to start scan." });
    } finally {
      setIsStartingScan(false);
    }
  };

  const onCancelScan = async () => {
    if (!targetId || activeScans.length === 0) return;
    setIsCancelingScan(true);
    try {
      const scanId = activeScans[0].id;
      const res = await apiFetch(getApiUrl(apiUrl, `/targets/${targetId}/scans/${scanId}/cancel`), { method: "POST" });
      if (res.ok) {
        toast.current?.show({ severity: "success", summary: "Success", detail: "Scan canceled." });
        fetchScansData();
      } else {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to cancel scan." });
      }
    } catch (e) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to cancel scan." });
    } finally {
      setIsCancelingScan(false);
    }
  };

  // -------------------------------------------------------------------------
  // SignalR
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!targetId) return;

    let newConnection: HubConnection | null = null;
    let isCancelled = false;

    const setupSignalR = async () => {
      try {
        const res = await apiFetch(`${apiUrl}/hub/public`, { method: "POST" });
        if (!res.ok) return;
        const data = await res.json();
        if (isCancelled) return;

        newConnection = new HubConnectionBuilder()
          .withUrl(data.url, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
            withCredentials: true,
          })
          .configureLogging(LogLevel.None)
          .withAutomaticReconnect()
          .build();

        newConnection.on("ScanCreated", fetchScansDebounced);
        newConnection.on("ScanStarted", fetchScansDebounced);
        newConnection.on("ScanUpdated", fetchScansDebounced);
        newConnection.on("ScanRunnerUpdated", () => {});
        newConnection.on("ScanCompleted", () => fetchDashboardDebounced());
        newConnection.on("ScanRunnerCompleted", () => fetchDashboardDebounced());
        newConnection.on("ScanFailed", () => fetchDashboardDebounced());

        await newConnection.start();
      } catch (e) {
        console.error("SignalR Connection Error: ", e);
      }
    };

    setupSignalR();

    return () => {
      isCancelled = true;
      if (newConnection) newConnection.stop();
    };
  }, [apiUrl, targetId, fetchScansDebounced, fetchDashboardDebounced]);

  // -------------------------------------------------------------------------
  // DNS grouping
  // -------------------------------------------------------------------------
  const groupedDnsRecords = useMemo(() => {
    if (!rootDomains || rootDomains.length === 0) return null;

    const targetRootDomain = rootDomains[0];

    return DnsFlattener.flattenRecords(
      targetRootDomain,
      showFullDns ? undefined : target?.hostname
    );
  }, [rootDomains, showFullDns, target?.hostname]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
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
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-6">
          <DashboardHeader
            target={target}
            targetPorts={targetPorts}
            onViewFullInsights={() => {
              const baseUrl = dashboardUrl.replace(/\/$/, "");
              window.open(
                `${baseUrl}/org/${organization.identifier}/targets/${target.id}`,
                "_blank",
              );
            }}
            isScanRunning={activeScans.length > 0}
            onStartScan={onStartScan}
            onCancelScan={onCancelScan}
            isStartingScan={isStartingScan}
            isCancelingScan={isCancelingScan}
          />

          {/* Active Scans Banner */}
          {activeScans.length > 0 && (
            <Panel header="Active Scans">
              {activeScans.map((scan) => (
                <div key={scan.id} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-center text-sm mb-2 text-blue-900 font-medium pb-2 border-b border-blue-100">
                    <div>
                      {/* Scanner name resolved via scannerId → collectorGroup.name */}
                      <span className="font-bold mr-2 text-base">
                        {getScannerName(scan)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Started: {formatDate(scan.startedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <TargetsScanProgressBar
                      scan={scan}
                      collectorMap={collectorMap}
                    />
                  </div>
                </div>
              ))}
            </Panel>
          )}

          {/* Top Vulnerabilities */}
          <Panel header="Top Vulnerabilities">
            <TopVulnerabilitiesTable vulnerabilities={vulnerabilities} />
          </Panel>

          {/* Certificates */}
          <Panel header="Certificates">
            <CertificatesTable
              certificates={certificates}
              isExcluded={isCertificatesExcluded}
              onUpgrade={onUpgrade}
            />
          </Panel>

          {/* DNS Records */}
          <Panel header="DNS Records">
            <DnsRecordsTable
              groupedRecords={groupedDnsRecords}
              showFullDns={showFullDns}
              setShowFullDns={setShowFullDns}
              isSubdomain={rootDomains.some(
                (rd) => rd.value !== target?.hostname,
              )}
              isExcluded={isDnsExcluded}
              onUpgrade={onUpgrade}
            />
          </Panel>

          {/* Recent Scans */}
          <Panel header="Recent Scans">
            <RecentScansTable
              recentScans={recentScans}
              scannerMap={scannerMap}
              collectorGroupMap={collectorGroupMap}
              collectorMap={collectorMap}
            />
          </Panel>
        </div>
      </div>
    </>
  );
}
