import { useEffect, useState, useMemo } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";

enum WizardStep {
  ORGANIZATION = "ORGANIZATION",
  TARGET = "TARGET",
  CREATE_TARGET = "CREATE_TARGET",
}

export default function SetupWizard() {
  // Data from WordPress PHP (catcher24WordpressConnector)
  const { siteHostname, siteName, organizationId, apiUrl } = catcher24WordpressConnector;

  const [step, setStep] = useState<WizardStep>(WizardStep.ORGANIZATION);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Lists
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [targets, setTargets] = useState<any[]>([]);

  // Current Selections
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // Create Target Form
  const [newTargetHostname, setNewTargetHostname] = useState(siteHostname || "");
  const [newTargetName, setNewTargetName] = useState(siteName || "");

  useEffect(() => {
    // If we already have an Org ID, skip to target fetching
    if (organizationId) {
      fetchTargets();
    } else {
      fetchOrganizations();
    }
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/organizations`);
      const data = await response.json();
      setOrganizations(data);
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
        body: JSON.stringify({ organization_id: selectedOrg.id }),
      });
      await fetchTargets();
    } finally {
      setActionLoading(false);
    }
  };

  const handleTargetSelect = async (targetId: string) => {
    setActionLoading(true);
    try {
      await fetch(`${apiUrl}/targets/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_id: targetId }),
      });
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
        window.location.reload();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const matchedTarget = useMemo(() => {
    return targets.find((t) => t.hostname === siteHostname);
  }, [targets, siteHostname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        <p className="mt-4 text-gray-500">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-lg shadow-xl border-surface-200">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Catcher24 Setup</h1>
          <p className="text-gray-500 mt-2">Connect your WordPress site to the SaaS platform.</p>
        </div>

        {/* Step 1: Organizations */}
        {step === WizardStep.ORGANIZATION && (
          <div className="flex flex-col gap-4">
            <label className="font-semibold">Select Organization</label>
            <Dropdown
              value={selectedOrg}
              options={organizations}
              optionLabel="displayName"
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

            <div className="max-h-60 overflow-y-auto border border-surface-200 rounded-md">
              {targets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleTargetSelect(t.id)}
                  className={`flex justify-between items-center p-4 cursor-pointer border-b last:border-0 hover:bg-surface-50 transition-colors ${
                    matchedTarget?.id === t.id ? "bg-primary-50 border-primary-200" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{t.preferredDisplayName}</span>
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
            <h2 className="text-xl font-semibold">Create New Target</h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="hostname" className="text-sm">Hostname</label>
              <InputText
                id="hostname"
                value={newTargetHostname}
                onChange={(e) => setNewTargetHostname(e.target.value)}
                placeholder="e.g. example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="displayname" className="text-sm">Display Name</label>
              <InputText
                id="displayname"
                value={newTargetName}
                onChange={(e) => setNewTargetName(e.target.value)}
                placeholder="e.g. My Production Site"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <Button
                label="Create & Connect"
                icon="pi pi-plus-circle"
                loading={actionLoading}
                onClick={handleCreateTarget}
                disabled={!newTargetHostname || !newTargetName}
              />
              <Button
                label="Back to Targets"
                className="p-button-text p-button-sm"
                onClick={() => setStep(targets.length > 0 ? WizardStep.TARGET : WizardStep.ORGANIZATION)}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
