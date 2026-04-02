import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import {OrganizationModel} from "../../../models";

interface Props {
  organizations: OrganizationModel[];
  selectedOrg: OrganizationModel | null;
  onSelectOrg: (org: OrganizationModel) => void;
  onContinue: () => void;
  isLoading: boolean;
}

export default function OrganizationStep({ organizations, selectedOrg, onSelectOrg, onContinue, isLoading }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <label className="font-semibold">Select Organization {organizations.length}</label>
      <Dropdown
        value={selectedOrg}
        options={organizations}
        optionLabel="name"
        dataKey="id"
        placeholder="Choose an organization"
        onChange={(e) => onSelectOrg(e.value)}
        className="w-full"
      />
      <Button
        label="Continue"
        icon="pi pi-arrow-right"
        iconPos="right"
        loading={isLoading}
        disabled={!selectedOrg}
        onClick={onContinue}
      />
    </div>
  );
}
