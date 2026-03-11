import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";

interface Organization {
  id: string;
  tenantId: string;
  displayName: string;
}

export default function OrganizationSelectionPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${catcher24WordpressConnector.apiUrl}/organizations`);
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleSelect = async () => {
    if (!selectedOrg) return;

    setSaving(true);
    try {
      await fetch(`${catcher24WordpressConnector.apiUrl}/organizations/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ organization_id: selectedOrg.id }),
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg border border-surface-200 dark:border-surface-700 text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold dark:text-white tracking-tight">Select Organization</h2>
          <p className="text-muted-foreground mt-2">Choose your workspace to continue</p>
        </div>

        <div className="flex flex-col gap-4">
          <Dropdown
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.value)}
            options={organizations}
            optionLabel="name"
            placeholder="Select an Organization"
            loading={loading}
            className="w-full text-left"
          />

          <Button
            label={saving ? "Saving..." : "Continue"}
            icon={saving ? "pi pi-spin pi-spinner" : "pi pi-arrow-right"}
            className="w-full"
            onClick={handleSelect}
            disabled={!selectedOrg || saving}
          />
        </div>
      </Card>
    </div>
  );
}
