import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { TargetModel } from "../../models/shared";

enum WizardStep {
  ORGANIZATION = "ORGANIZATION",
  TARGET = "TARGET",
  CREATE_TARGET = "CREATE_TARGET",
}

const isLocalhost = (hostname: string) => {
  const normalized = hostname.toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized.endsWith(".local");
};

export default function SetupWizard() {
  const navigate = useNavigate();
  // Data from WordPress PHP (catcher24WordpressConnector)
  const { siteHostname, siteName, organizationId, hasSingleOrganization, targetId, apiUrl } = catcher24WordpressConnector;

  const [step, setStep] = useState<WizardStep>(WizardStep.ORGANIZATION);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Lists
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [targets, setTargets] = useState<TargetModel[]>([]);

  // Current Selections
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // Create Target Form
  const [newTargetHostname, setNewTargetHostname] = useState(siteHostname || "");
  const [newTargetName, setNewTargetName] = useState(siteName || "");

  useEffect(() => {
    // If we already have a target ID, redirect to dashboard
    if (organizationId && targetId) {
      navigate("/");
      return;
    }

    // If we already have an Org ID, skip to target fetching
    if (organizationId) {
      fetchTargets();
    } else {
      fetchOrganizations();
    }
  }, [organizationId, targetId, navigate]);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/organizations`);
      const data = await response.json();
      setOrganizations(data);
      if (organizationId) {
        const currentOrg = data.find((org: any) => org.id === organizationId || org.identifier === organizationId || org.name === organizationId);
        if (currentOrg) setSelectedOrg(currentOrg);
      }
      setStep(WizardStep.ORGANIZATION);
    } catch (error) {
      console.error("Failed to fetch organizations", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTargets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/targets`);
      const data = await response.json();
      const items = data.items || [];
      setTargets(items);

      // Fetch org details if we skipped fetchOrganizations
      if (!selectedOrg) {
        const orgRes = await fetch(`${apiUrl}/organizations`);
        const orgData = await orgRes.json();
        const currentOrg = orgData.find((org: any) => org.id === organizationId || org.identifier === organizationId || org.name === organizationId);
        if (currentOrg) setSelectedOrg(currentOrg);
      }

      if (items.length === 0) {
        setStep(WizardStep.CREATE_TARGET);
      } else {
        setStep(WizardStep.TARGET);
      }
    } catch (error) {
      console.error("Failed to fetch targets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSubmit = async () => {
    if (!selectedOrg) return;
    setActionLoading(true);
    try {
      await fetch(`${apiUrl}/organizations/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: selectedOrg.id || selectedOrg.name }),
      });
      await fetchTargets();
    } finally {
      setActionLoading(false);
    }
  };

  const handleTargetSelect = async (selectedTargetId: string) => {
    setActionLoading(true);
    try {
      await fetch(`${apiUrl}/targets/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_id: selectedTargetId }),
      });
      window.location.hash = "#/";
      window.location.reload();
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTarget = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${apiUrl}/targets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostname: newTargetHostname,
          displayName: newTargetName,
          type: 0, // TargetType.Web
        }),
      });
      const data = await res.json();
      if (data.id) {
        window.location.hash = "#/";
        window.location.reload();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const matchedTarget = useMemo(() => {
    return targets.find((t) => t.hostname === siteHostname);
  }, [targets, siteHostname]);

  const isSubscriptionLimitReached = useMemo(() => {
    if (!selectedOrg) return false;

    // Check usage metric map (API might return TargetType.Web as "0" or "Web" depending on formatter, handling both)
    const usageObj = selectedOrg.usageMetrics?.targetTypeCounts;
    const webAppUsage = usageObj ? (usageObj["0"] || usageObj["Web"] || 0) : 0;

    let webAppLimit = 0;
    const packageMap = selectedOrg.subscription?.tenantOrganizationPackages;
    const packages = packageMap ? (packageMap["0"] || packageMap["Web"]) : null;

    if (packages) {
      webAppLimit = Object.values(packages).reduce((acc: number, current: any) => acc + (current.unitCount || 0), 0);
    }

    // If there is a limit set and usage meets or exceeds it, prevent creation
    return webAppLimit > 0 && webAppUsage >= webAppLimit;
  }, [selectedOrg]);

  const isInvalidHostname = useMemo(() => {
    return isLocalhost(newTargetHostname);
  }, [newTargetHostname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        <p className="mt-4 text-gray-500">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg shadow-xl border-secondary-light">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold ">Catcher24 Setup</h1>
          <p className="text-gray-500 mt-2">Connect your WordPress site to the SaaS platform.</p>
        </div>

        {/* Step 1: Organizations */}
        {step === WizardStep.ORGANIZATION && (
          <div className="flex flex-col gap-4">
            <label className="font-semibold">Select Organization</label>
            <Dropdown
              value={selectedOrg}
              options={organizations}
              optionLabel="name"
              placeholder="Choose an organization"
              onChange={(e) => setSelectedOrg(e.value)}
              className="w-full"
            />
            <Button
              label="Continue"
              icon="pi pi-arrow-right"
              iconPos="right"
              loading={actionLoading}
              disabled={!selectedOrg}
              onClick={handleOrgSubmit}
            />
          </div>
        )}

        {/* Step 2: Targets Selection */}
        {step === WizardStep.TARGET && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <label className="font-semibold">Select Target</label>
              <Button
                label="Change Organization"
                icon="pi pi-undo"
                className="p-button-link p-0 text-xs"
                onClick={() => setStep(WizardStep.ORGANIZATION)}
              />
            </div>

            {matchedTarget ? (
              <Message
                severity="success"
                className="w-full justify-start"
                content={
                  <div className="flex align-items-center">
                    <i className="pi pi-check-circle mr-2" />
                    <span>Found a target matching <b>{siteHostname}</b></span>
                  </div>
                }
              />
            ) : (
              <Message
                severity="warn"
                className="w-full justify-start"
                content={
                  <div className="flex flex-col">
                    <span>This site (<b>{siteHostname}</b>) isn't registered yet.</span>
                    <Button
                      label="Create target for this hostname"
                      className="p-button-link p-0 text-xs text-left"
                      onClick={() => setStep(WizardStep.CREATE_TARGET)}
                    />
                  </div>
                }
              />
            )}

            <div className="max-h-60 overflow-y-auto border border-secondary-light rounded-md">
              {targets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleTargetSelect(t.id)}
                  className={`flex justify-between items-center p-4 cursor-pointer border-b last:border-0 hover:bg-tertiary-lighter transition-colors ${
                    matchedTarget?.id === t.id ? "bg-primary-50 border-primary-200" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{t.preferredDisplayName || t.displayName || t.hostname}</span>
                    <span className="text-xs text-gray-500">{t.hostname}</span>
                  </div>
                  <i className={`pi ${matchedTarget?.id === t.id ? "pi-star-fill text-yellow-500" : "pi-chevron-right text-gray-300"}`} />
                </div>
              ))}
            </div>

            <Divider align="center">
              <span className="text-gray-400 text-xs">OR</span>
            </Divider>

            <Button
              label="Create New Target"
              icon="pi pi-plus"
              className="p-button-outlined"
              onClick={() => setStep(WizardStep.CREATE_TARGET)}
            />
          </div>
        )}

        {/* Step 3: Create Target */}
        {step === WizardStep.CREATE_TARGET && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create New Target</h2>
              {!hasSingleOrganization && (
                <Button
                  label="Back"
                  icon="pi pi-arrow-left"
                  className="p-button-link p-0 text-xs"
                  onClick={() => setStep(targets.length > 0 ? WizardStep.TARGET : WizardStep.ORGANIZATION)}
                />
              )}
            </div>

            {isSubscriptionLimitReached && (
              <Message
                severity="error"
                className="w-full justify-start"
                content={
                  <div className="flex flex-col gap-1">
                    <span><b>Subscription Limit Reached.</b></span>
                    <span className="text-sm">Your organization has reached the maximum number of Web Application targets allowed by its subscription.</span>
                    <a href="https://catcher24.com/dashboard/organization/settings/billing" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline text-sm font-medium">
                      Upgrade your subscription on Catcher24
                    </a>
                  </div>
                }
              />
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="hostname" className="text-sm">Hostname</label>
              <InputText
                id="hostname"
                value={newTargetHostname}
                onChange={(e) => setNewTargetHostname(e.target.value)}
                placeholder="e.g. example.com"
                disabled={isSubscriptionLimitReached}
                className={isInvalidHostname ? "p-invalid" : ""}
              />
              {isInvalidHostname && (
                <small className="text-red-500">Local URLs (e.g. localhost, 127.0.0.1) are not supported.</small>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="displayname" className="text-sm">Display Name</label>
              <InputText
                id="displayname"
                value={newTargetName}
                onChange={(e) => setNewTargetName(e.target.value)}
                placeholder="e.g. My Production Site"
                disabled={isSubscriptionLimitReached}
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <Button
                label="Create & Connect"
                icon="pi pi-plus-circle"
                loading={actionLoading}
                onClick={handleCreateTarget}
                disabled={!newTargetHostname || !newTargetName || isSubscriptionLimitReached || isInvalidHostname}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
