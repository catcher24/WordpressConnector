import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { TargetModel } from "../../../models";

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
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const matchedTarget = useMemo(() => {
    return targets.find((t) => getExistingTargetAddress(t) === siteHostname);
  }, [targets, siteHostname]);

  const filteredTargets = useMemo(() => {
    if (!searchQuery) return targets;
    const lowerQuery = searchQuery.toLowerCase();
    return targets.filter((t) => {
      const address = getExistingTargetAddress(t).toLowerCase();
      const name = (t.preferredDisplayName || t.displayName || "").toLowerCase();
      return name.includes(lowerQuery) || address.includes(lowerQuery);
    });
  }, [targets, searchQuery]);

  if (matchedTarget && !viewAll) {
    const address = getExistingTargetAddress(matchedTarget);
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Target Match Found</label>
          <Button
            label="Change Organization"
            icon="pi pi-undo"
            severity="secondary"
            text
            className="p-0 text-[11px] h-auto font-semibold"
            onClick={onChangeOrg}
            disabled={isLoading}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-1">
            <i className="pi pi-check text-primary-600 text-2xl font-bold"></i>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-2xl font-extrabold text-gray-900 m-0 leading-tight">
              {matchedTarget.preferredDisplayName || matchedTarget.displayName || address}
            </h3>
            <p className="text-gray-400 text-sm font-medium tracking-tight">{address}</p>
          </div>

          <Button
            label="Connect this Target"
            icon="pi pi-link"
            className="w-full h-12 text-base font-bold shadow-md"
            onClick={() => onSelectTarget(matchedTarget.id)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col items-center gap-4 py-2">
          <span className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.2em]">Not your target?</span>
          <div className="flex items-center gap-6">
            <Button
              label="View all"
              icon="pi pi-list"
              severity="secondary"
              text
              className="p-0 text-xs font-bold h-auto"
              onClick={() => setViewAll(true)}
              disabled={isLoading}
            />
            <div className="w-[1px] h-4 bg-gray-200" />
            <Button
              label="Create new"
              icon="pi pi-plus"
              severity="success"
              className="p-0 text-xs font-bold h-auto"
              onClick={onCreateNew}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Select Target</label>
        <Button
          label="Change Organization"
          icon="pi pi-undo"
          severity="secondary"
          text
          className="p-0 text-[11px] h-auto font-semibold"
          onClick={onChangeOrg}
          disabled={isLoading}
        />
      </div>

      {!matchedTarget && (
        <>
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
            <i className="pi pi-info-circle text-blue-500 mt-0.5 text-lg" />
            <div className="flex flex-col gap-1">
              <span className="text-sm text-blue-900 font-medium whitespace-normal">
                This site (<b className="text-blue-700 font-bold">{siteHostname}</b>) isn't registered yet.
              </span>
              <Button
                label="Create target for this address"
                severity="success"
                size="small"
                onClick={onCreateNew}
                disabled={isLoading}
              />
            </div>
          </div>
          {targets.length > 0 && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-[1px] bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">OR SELECT ANOTHER</span>
              <div className="flex-1 h-[1px] bg-gray-100" />
            </div>
          )}
        </>
      )}

      {targets.length > 5 && (
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search text-gray-400" />
          <InputText
            placeholder="Search your targets..."
            className="w-full bg-gray-50 border-gray-200 focus:bg-white transition-all h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </span>
      )}

      <div className="max-h-[320px] overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-inner">
        {filteredTargets.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm font-medium">No results for "{searchQuery}"</div>
        ) : (
          filteredTargets.map((t) => {
            const address = getExistingTargetAddress(t);
            const isMatched = matchedTarget?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => !isLoading && onSelectTarget(t.id)}
                className={`flex justify-between items-center p-4 cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group ${isMatched ? "bg-primary-50/30 hover:bg-primary-50/50" : ""
                  }`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${isMatched ? "text-primary-800" : "text-gray-700"}`}>
                      {t.preferredDisplayName || t.displayName || address}
                    </span>
                    {isMatched && <span className="text-[10px] bg-primary-100/50 text-primary-700 font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter">Matched</span>}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{address}</span>
                </div>
                <i className={`pi pi-chevron-right text-sm transition-transform group-hover:translate-x-1 ${isMatched ? "text-primary-400" : "text-gray-300"}`} />
              </div>
            );
          })
        )}
      </div>

      {matchedTarget && (
        <>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-[1px] bg-gray-100" />
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">OR</span>
            <div className="flex-1 h-[1px] bg-gray-100" />
          </div>

          <Button
            label="Create New Target"
            icon="pi pi-plus"
            severity="success"
            className="w-full h-11 font-bold pt-1"
            onClick={onCreateNew}
            disabled={isLoading}
          />
        </>
      )}
    </div>
  );
}
