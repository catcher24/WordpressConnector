import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { OrganizationModel, TargetModel } from "../../models";
import { apiFetch } from "../../utils/api-fetch";

import OrganizationStep from "./steps/organization-step";
import TargetSelectionStep from "./steps/target-selection-step";
import CreateTargetWizard from "./steps/create-target-wizard";

export enum WizardStep {
  ORGANIZATION = "ORGANIZATION",
  TARGET = "TARGET",
  CREATE_TARGET = "CREATE_TARGET",
}

export default function SetupWizard() {
  const navigate = useNavigate();
  // Assuming this is injected globally or imported
  const { siteHostname, organizationId, targetId, apiUrl, hasSingleOrganization } = catcher24Connector;

  const [step, setStep] = useState<WizardStep>(WizardStep.ORGANIZATION);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [organizations, setOrganizations] = useState<OrganizationModel[]>([]);
  const [targets, setTargets] = useState<TargetModel[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationModel | null>(null);

  useEffect(() => {
    const initializeWizard = async () => {
      setLoading(true);

      // 1. Always fetch organizations first
      await fetchOrganizations();

      // 2. If we already have a target, just go home
      if (organizationId && targetId) {
        navigate("/");
        return;
      }

      // 3. If we have an org selected (or restricted), fetch the targets
      if (organizationId) {
        await fetchTargets();
      } else {
        setStep(WizardStep.ORGANIZATION);
        setLoading(false);
      }
    };

    initializeWizard();
  }, [organizationId, targetId, navigate]);

// Updated fetchOrganizations to return the data for immediate use
  const fetchOrganizations = async () => {
    try {
      const response = await apiFetch(`${apiUrl}/organizations`);
      const data = await response.json();
      setOrganizations(data);

      // Set the selectedOrg immediately based on global state
      if (organizationId) {
        const currentOrg = data.find(
          (org: any) => org.id === organizationId || org.identifier === organizationId || org.name === organizationId
        );
        if (currentOrg) {
          setSelectedOrg(OrganizationModel.asOrganizationModel(currentOrg));
        }
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch organizations", error);
      return [];
    }
  };

// Updated fetchTargets to use the orgs list if needed
  const fetchTargets = async () => {
    try {
      const response = await apiFetch(`${apiUrl}/targets`);
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
      await apiFetch(`${apiUrl}/organizations/select`, {
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
      await apiFetch(`${apiUrl}/targets/select`, {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        <p className="mt-4 text-gray-500">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[500px] py-12 px-4 w-full items-center justify-center bg-gray-50 border border-gray-200 rounded-xl">
      <Card className="w-full max-w-lg shadow-sm border border-gray-200 rounded-xl p-2 bg-white">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="bg-primary-50 text-primary-500 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-primary-100">
            <i className="pi pi-cog text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Catcher24 Setup</h1>
          <p className="text-gray-500 mt-2 text-sm">Connect your WordPress site to the platform.</p>
        </div>

        {step === WizardStep.ORGANIZATION && (
          <OrganizationStep
            organizations={organizations}
            selectedOrg={selectedOrg}
            onSelectOrg={(org) => setSelectedOrg(OrganizationModel.asOrganizationModel(org))}
            onContinue={handleOrgSubmit}
            isLoading={actionLoading}
          />
        )}

        {step === WizardStep.TARGET && (
          <TargetSelectionStep
            targets={targets}
            siteHostname={siteHostname}
            onSelectTarget={handleTargetSelect}
            onCreateNew={() => setStep(WizardStep.CREATE_TARGET)}
            onChangeOrg={() => setStep(WizardStep.ORGANIZATION)}
            isLoading={actionLoading}
          />
        )}

        {step === WizardStep.CREATE_TARGET && (
          <CreateTargetWizard
            selectedOrg={selectedOrg}
            siteHostname={siteHostname}
            apiUrl={apiUrl}
            hasSingleOrganization={hasSingleOrganization ?? false}
            canGoBack={targets.length > 0 || (!organizationId && organizations.length > 1)}
            onCancel={() => setStep(targets.length > 0 ? WizardStep.TARGET : WizardStep.ORGANIZATION)}
          />
        )}
      </Card>
    </div>
  );
}
