import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { TargetFormData } from "./create-target-wizard";
import RadioCard from "../../../components/form/RadioCard";
import { AllowedScheduleIntervals, CollectorCollectionMethod } from "../../../enums";
import CronInput from "../../../components/form/CronInput";
import { OrganizationModel } from "../../../models";

interface Props {
  formData: TargetFormData;
  updateForm: (data: Partial<TargetFormData>) => void;
  disabled: boolean;
  allowedCollectionMethods: CollectorCollectionMethod[];
  allowedScheduleIntervals: AllowedScheduleIntervals;
  selectedOrganization?: OrganizationModel;
  errors?: Record<string, string[]>;
}

export default function TargetDetailsStep({
  formData,
  updateForm,
  disabled,
  allowedCollectionMethods,
  allowedScheduleIntervals,
  selectedOrganization,
  errors = {}
}: Props) {
  const { dashboardUrl } = catcher24WordpressConnector;

  const isLocalhost = (address: string) =>
    ["localhost", "127.0.0.1"].includes(address.toLowerCase()) ||
    address.includes("://localhost") ||
    address.includes("://127.0.0.1");

  const isInvalidAddress = formData.targetAddress ? isLocalhost(formData.targetAddress) : false;

  const targetAddressErrors = errors.TargetAddress || [];
  const hasTargetAddressError = isInvalidAddress || targetAddressErrors.length > 0;

  const collectionMethodOptions = [
    {
      id: CollectorCollectionMethod.OnRequest,
      title: "On Request",
      description: "Trigger scans manually or via API.",
      icon: "pi pi-play"
    },
    {
      id: CollectorCollectionMethod.OnSchedule,
      title: "On Schedule",
      description: "Automate scans at a recurring interval.",
      icon: "pi pi-calendar-clock"
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="targetaddress" className="text-sm font-semibold">
            Target Address <span className="text-danger">*</span>
          </label>
          <InputText
            id="targetaddress"
            value={formData.targetAddress}
            onChange={(e) => updateForm({ targetAddress: e.target.value })}
            placeholder="e.g. example.com or https://api.mysite.com"
            disabled={disabled}
            className={hasTargetAddressError ? "p-invalid w-full" : "w-full"}
          />
          {isInvalidAddress && (
            <small className="text-secondary font-medium">
              <i className="pi pi-exclamation-circle mr-1"></i>
              Local URLs are not supported for remote scanning.
            </small>
          )}
          {targetAddressErrors.map((err, idx) => (
            <small key={idx} className="text-danger font-medium">
              <i className="pi pi-exclamation-circle mr-1"></i>
              {err}
            </small>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="displayname" className="text-sm font-semibold text-gray-600">
            Display Name (Optional)
          </label>
          <InputText
            id="displayname"
            value={formData.displayName}
            onChange={(e) => updateForm({ displayName: e.target.value })}
            placeholder="e.g. Production Environment"
            disabled={disabled}
            className="w-full"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">Collection Method</label>
        <div className="grid grid-cols-1 gap-3">
          {collectionMethodOptions.map((option) => {
            const isAllowed = allowedCollectionMethods.includes(option.id);

            return (
              <RadioCard
                key={option.id}
                id={option.id}
                title={option.title}
                icon={option.icon}
                checked={formData.collectionMethod === option.id}
                disabled={disabled || !isAllowed}
                onChange={(id) => {
                  if (isAllowed) {
                    updateForm({
                      collectionMethod: id as CollectorCollectionMethod,
                      scheduleInterval: id === CollectorCollectionMethod.OnSchedule ? formData.scheduleInterval : ""
                    });
                  }
                }}
                description={
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-gray-600">{option.description}</div>
                    {!isAllowed && selectedOrganization?.identifier && (
                      <a
                        href={`${dashboardUrl}/org/${selectedOrganization.identifier}/subscription`}
                        className="p-button p-button-sm p-button-outlined w-max"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Upgrade to access
                      </a>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      </div>

      {formData.collectionMethod === CollectorCollectionMethod.OnSchedule && (
        <div className="flex flex-col gap-3 mt-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
          <label className="text-xs font-bold text-blue-900 tracking-wide uppercase">
            <i className="pi pi-clock mr-2"></i>
            Schedule Configuration
          </label>
          <CronInput
            value={formData.scheduleInterval}
            allowedInterval={allowedScheduleIntervals}
            onChange={(cron) => updateForm({ scheduleInterval: cron })}
          />
          {errors.ScheduleInterval?.map((err, idx) => (
            <small key={idx} className="text-red-500 font-medium">
              <i className="pi pi-exclamation-circle mr-1"></i>
              {err}
            </small>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md border border-gray-200">
          <Checkbox
            inputId="startOnCreate"
            checked={formData.startOnCreate}
            onChange={(e) => updateForm({ startOnCreate: e.checked ?? false })}
            disabled={disabled}
          />
          <label htmlFor="startOnCreate" className="text-sm font-medium cursor-pointer select-none text-gray-700">
            Start scan immediately after creating target
          </label>
        </div>

        <div className="bg-warning-lighter border border-warning-light rounded-xl p-4 flex gap-4 text-left shadow-sm">
          <i className="pi pi-exclamation-triangle text-warning-dark mt-0.5 text-xl flex-shrink-0" />
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-warning-darker leading-normal font-medium">
              <strong>Warning:</strong> Active scanning involves automated interactions designed to identify security flaws. While safe for secure systems, these probes can cause unintended database write operations on vulnerable sites, resulting in the generation of automated posts, metadata, or comments.
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-warning-light/50">
              <Checkbox
                inputId="acknowledged"
                checked={formData.acknowledged}
                onChange={e => updateForm({ acknowledged: e.checked ?? false })}
                disabled={disabled}
              />
              <label htmlFor="acknowledged" className="text-xs font-bold text-warning-darker cursor-pointer select-none">
                I understand and acknowledge these risks
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
