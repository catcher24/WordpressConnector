import { useMemo } from "react";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import {TargetModel} from "../../../models";

interface Props {
  targets: TargetModel[];
  siteHostname: string;
  onSelectTarget: (id: string) => void;
  onCreateNew: () => void;
  onChangeOrg: () => void;
  isLoading: boolean;
}

const getExistingTargetAddress = (t: any) => t.hostname || t.ip || "";

export default function TargetSelectionStep({ targets, siteHostname, onSelectTarget, onCreateNew, onChangeOrg, isLoading }: Props) {
  const matchedTarget = useMemo(() => {
    return targets.find((t) => getExistingTargetAddress(t) === siteHostname);
  }, [targets, siteHostname]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <label className="font-semibold">Select Target</label>
        <Button label="Change Organization" icon="pi pi-undo" className="p-button-link p-0 text-xs" onClick={onChangeOrg} disabled={isLoading} />
      </div>

      {matchedTarget ? (
        <Message severity="success" className="w-full justify-start" content={<span>Found a target matching <b>{siteHostname}</b></span>} />
      ) : (
        <Message severity="warn" className="w-full justify-start" content={
          <div className="flex flex-col">
            <span>This site (<b>{siteHostname}</b>) isn't registered yet.</span>
            <Button label="Create target for this address" className="p-button-link p-0 text-xs text-left" onClick={onCreateNew} disabled={isLoading}/>
          </div>
        } />
      )}

      <div className="max-h-60 overflow-y-auto border border-secondary-light rounded-md">
        {targets.map((t) => {
          const address = getExistingTargetAddress(t);
          return (
            <div
              key={t.id}
              onClick={() => !isLoading && onSelectTarget(t.id)}
              className={`flex justify-between items-center p-4 cursor-pointer border-b last:border-0 hover:bg-tertiary-lighter transition-colors ${matchedTarget?.id === t.id ? "bg-primary-50 border-primary-200" : ""}`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{t.preferredDisplayName || t.displayName || address}</span>
                <span className="text-xs text-gray-500">{address}</span>
              </div>
              <i className={`pi ${matchedTarget?.id === t.id ? "pi-star-fill text-warning" : "pi-chevron-right text-gray-300"}`} />
            </div>
          );
        })}
      </div>

      <Divider align="center"><span className="text-gray-400 text-xs">OR</span></Divider>

      <Button label="Create New Target" icon="pi pi-plus" className="p-button-outlined" onClick={onCreateNew} disabled={isLoading} />
    </div>
  );
}
