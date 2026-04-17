import { useState, useEffect, useMemo } from "react";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Message } from "primereact/message";
import TargetTypeStep from "./target-type-step";
import TargetDetailsStep from "./target-details-step";
import { OrganizationModel } from "../../../models";
import { useOrganizationCapabilities } from "../../../hooks/useOrganizationCapabilities";
import { AllowedScheduleIntervals, CollectorCollectionMethod, TargetType } from "../../../enums";
import { CreateTargetCommand } from "../../../models/commands/create-target.command";

interface Props {
  selectedOrg: OrganizationModel | null;
  siteHostname: string;
  apiUrl: string;
  hasSingleOrganization: boolean;
  onCancel: () => void;
  initialStep?: number;
}

const initialFormState = {
  type: TargetType.Host,
  collectorGroupId: "" as string,
  displayName: "",
  targetAddress: "",
  collectionMethod: CollectorCollectionMethod.OnRequest,
  scheduleInterval: "",
  startOnCreate: true,
  acknowledged: false,
};

export type TargetFormData = typeof initialFormState;

export default function CreateTargetWizard({ selectedOrg, siteHostname, apiUrl, hasSingleOrganization, onCancel, initialStep = 1 }: Props) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<TargetFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoselected, setIsAutoselected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const orgModel = useMemo(() => OrganizationModel.asOrganizationModel(selectedOrg), [selectedOrg]);
  const { getTargetCapabilities } = useOrganizationCapabilities(orgModel);

  const isLocked = hasSingleOrganization && (currentStep === 1 || isAutoselected);
  const showBackButton = !isLocked;
  const buttonLabel = isAutoselected ? "Cancel" : "Back";

  const handleBackAction = () => {
    if (isAutoselected) {
      onCancel();
    } else {
      setCurrentStep(1);
    }
  };

  const currentCapabilities = useMemo(() => {
    if (!formData.type) return { allowedCollectionMethods: [], allowedScheduleIntervals: AllowedScheduleIntervals.None };
    return getTargetCapabilities(formData.type);
  }, [formData.type, getTargetCapabilities]);

  useEffect(() => {
    if (siteHostname && !formData.targetAddress) {
      setFormData(prev => ({ ...prev, targetAddress: siteHostname }));
    }
  }, [siteHostname]);

  const updateForm = (fields: Partial<TargetFormData>) => {
    setGeneralError(null);
    setFieldErrors({});
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleAutoselect = (groupId: string, type: TargetType) => {
    setGeneralError(null);
    setFieldErrors({});
    setFormData(prev => ({ ...prev, collectorGroupId: groupId, type }));
    setIsAutoselected(true);
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const payload = CreateTargetCommand.createTargetCommandValue(formData);
      const res = await fetch(`${apiUrl}/targets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          throw new Error("Failed to create target. Server returned an invalid response.");
        }

        if (res.status === 400 && errorData.errors) {
          setFieldErrors(errorData.errors);
          setGeneralError(errorData.title || "One or more validation errors occurred.");
          return;
        }

        throw new Error(errorData.title || errorData.message || "An unexpected error occurred.");
      }

      window.location.reload();
    } catch (err: any) {
      setGeneralError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepHeader = () => {
    if (isInitializing) {
      return <Skeleton width="30%" height="1.2rem" />;
    }
    if (isAutoselected) return null;

    return <h2 className="text-xl font-bold border-b pb-2">Step {currentStep} of 2</h2>;
  };

  return (
    <div className="flex flex-col gap-4">
      {renderStepHeader()}

      {generalError && (
        <Message severity="error" text={generalError} className="w-full justify-start" />
      )}

      {currentStep === 1 && (
        <TargetTypeStep
          formData={formData}
          updateForm={updateForm}
          selectedOrganization={selectedOrg || undefined}
          onAutoselect={handleAutoselect}
          setIsInitializing={setIsInitializing}
        />
      )}

      {currentStep === 2 && (
        <TargetDetailsStep
          formData={formData}
          updateForm={updateForm}
          disabled={isSubmitting}
          selectedOrganization={selectedOrg || undefined}
          allowedCollectionMethods={currentCapabilities.allowedCollectionMethods}
          allowedScheduleIntervals={currentCapabilities.allowedScheduleIntervals}
          errors={fieldErrors}
        />
      )}

      <div className="flex justify-between mt-4">
        {showBackButton ? (
          <Button
            label={buttonLabel}
            icon={isAutoselected ? "pi pi-times" : "pi pi-arrow-left"}
            onClick={handleBackAction}
            disabled={isSubmitting}
            className="p-button-text text-gray-600"
          />
        ) : (
          <div />
        )}
        {currentStep === 1 ? (
          <Button label="Next" onClick={() => setCurrentStep(2)} disabled={!formData.collectorGroupId} />
        ) : (
          <Button label="Create" onClick={handleSubmit} loading={isSubmitting} disabled={!formData.targetAddress || !formData.acknowledged} />
        )}
      </div>
    </div>
  );
}
