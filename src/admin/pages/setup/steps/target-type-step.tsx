import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from 'primereact/skeleton';
import RadioCard from "../../../components/form/RadioCard";
import { TargetType } from "../../../enums";
import { CollectorGroupModel, OrganizationModel } from "../../../models";
import { getApiUrl } from "../../../helpers";
import { useOrganizationCapabilities } from "../../../hooks/useOrganizationCapabilities";

interface Props {
  formData: any;
  updateForm: (data: any) => void;
  selectedOrganization?: OrganizationModel;
  onAutoselect: (groupId: string, type: TargetType) => void;
  setIsInitializing: (loading: boolean) => void;
}

export default function TargetTypeStep({ formData, updateForm, selectedOrganization, onAutoselect, setIsInitializing }: Props) {
  const { apiUrl, dashboardUrl } = catcher24WordpressConnector;
  const [groups, setGroups] = useState<CollectorGroupModel[]>([]);
  const [loading, setLoading] = useState(true);

  const { isCollectorGroupAllowed } = useOrganizationCapabilities(selectedOrganization || null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setIsInitializing(true);
        const response = await fetch(getApiUrl(apiUrl, "/collectorGroups"));
        const data = await response.json();
        const mappedGroups = (Array.isArray(data) ? data : data.items || [])
          .map(CollectorGroupModel.asCollectorGroupModel);
        setGroups(mappedGroups);
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [apiUrl]);

  // Handle Logic for skipping step
  const allowedGroups = useMemo(() =>
      groups.filter(g => isCollectorGroupAllowed(g.id, g.targetType)),
    [groups, isCollectorGroupAllowed]);

  useEffect(() => {
    if (!loading) {
      if (allowedGroups.length === 1 && !formData.collectorGroupId) {
        onAutoselect(allowedGroups[0].id, allowedGroups[0].targetType);
      }

      setIsInitializing(false);
    }
  }, [loading, allowedGroups, formData.collectorGroupId, onAutoselect]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton width="30%" height="1.2rem" />
        <Skeleton width="100%" height="80px" />
        <Skeleton width="100%" height="80px" />
      </div>
    );
  }

  // Prevent UI flash if we are about to skip
  if (allowedGroups.length === 1 && !formData.collectorGroupId) return null;

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-semibold text-gray-700">Select Target Type</label>
      <div className="grid grid-cols-1 gap-3">
        {groups.map((group) => {
          const isAllowed = isCollectorGroupAllowed(group.id, group.targetType);
          return (
            <RadioCard
              key={group.id}
              id={group.id}
              title={group.name}
              description={
                <div className="flex flex-col gap-2">
                  <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: group.description }} />
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
              icon={group.targetType === TargetType.WebApplication ? "pi pi-globe" : "pi pi-server"}
              checked={formData.collectorGroupId === group.id}
              disabled={!isAllowed}
              onChange={(groupId) => updateForm({ collectorGroupId: groupId, type: group.targetType })}
            />
          );
        })}
      </div>
    </div>
  );
}
