"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"

import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { ProgressSpinner } from "primereact/progressspinner"
import {classNames} from "primereact/utils";

const settingsFormSchema = z.object({
  organizationId: z.string().min(1, { message: "Please select an organization." }),
  targetId: z.string().min(1, { message: "Please select a target." }),
  targetDisplayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  })
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export function SettingsForm() {
  const toast = useRef<Toast>(null)

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [targets, setTargets] = useState<any[]>([])

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      organizationId: "",
      targetId: "",
      targetDisplayName: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    async function initialize() {
      try {
        const { organizationId, targetId, apiUrl } = catcher24WordpressConnector

        // Fetch Data
        const [orgsRes, targetsRes] = await Promise.all([
          fetch(`${apiUrl}/organizations`),
          fetch(`${apiUrl}/targets`)
        ])

        const orgsData = await orgsRes.json()
        const targetsData = await targetsRes.json()
        const targetsList = targetsData.items || []

        setOrganizations(orgsData || [])
        setTargets(targetsList)

        // Set Default Values
        const activeTarget = targetsList.find((t: any) => t.id === targetId)

        form.reset({
          organizationId: organizationId || "",
          targetId: targetId || "",
          targetDisplayName: activeTarget?.displayName || activeTarget?.preferredDisplayName || "",
        })
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load connection settings.",
        })
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [form])

  async function onSubmit(data: SettingsFormValues) {
    setIsSubmitting(true)
    const { apiUrl, organizationId: currentOrgId, targetId: currentTargetId } = catcher24WordpressConnector
    let needsReload = false

    try {
      // 1. Switch Organization
      if (data.organizationId !== currentOrgId) {
        await fetch(`${apiUrl}/organizations/select`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization_id: data.organizationId }),
        })
        needsReload = true
      }

      // 2. Switch Target
      if (data.targetId !== currentTargetId) {
        await fetch(`${apiUrl}/targets/select`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_id: data.targetId }),
        })
        needsReload = true
      }

      // 3. Update Target Details
      const originalTarget = targets.find((t) => t.id === data.targetId)
      const hasEditedTarget =
        originalTarget &&
        (originalTarget.displayName !== data.targetDisplayName)

      if (hasEditedTarget) {
        await fetch(`${apiUrl}/targets/${data.targetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: data.targetDisplayName,
          }),
        })
        needsReload = true
      }

      toast.current?.show({
        severity: "success",
        summary: "Settings Updated",
        detail: needsReload ? "Reloading to apply changes..." : "Target updated successfully.",
        life: 3000,
      })

      if (needsReload) {
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Update Failed",
        detail: "Could not save your changes. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format options for PrimeReact Dropdowns
  const orgOptions = organizations.map((org) => ({
    label: org.name,
    value: org.id || org.name,
  }))

  const targetOptions = targets.map((t) => ({
    label: t.preferredDisplayName || t.displayName || t.hostname,
    value: t.id,
  }))

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <ProgressSpinner style={{ width: "40px", height: "40px" }} />
      </div>
    )
  }

  return (
    <>
      <Toast ref={toast} position="top-center" />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Organization Switcher */}
        <div className="flex flex-col gap-2">
          <label htmlFor="organizationId" className="text-sm font-medium">Organization</label>
          <Controller
            name="organizationId"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={orgOptions}
                  placeholder="Select Organization"
                  disabled={organizations.length <= 1 || isSubmitting}
                  className={classNames("w-full", fieldState.invalid && "p-invalid")}
                />
                <small className="text-muted-foreground">
                  {organizations.length <= 1
                    ? "You are only a member of one organization."
                    : "Switching organizations will reload the integration context."}
                </small>
                {fieldState.error && (
                  <small className="text-red-500 font-medium">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        {/* Target Switcher */}
        <div className="flex flex-col gap-2">
          <label htmlFor="targetId" className="text-sm font-medium">Connected Target</label>
          <Controller
            name="targetId"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  id={field.name}
                  value={field.value}
                  options={targetOptions}
                  placeholder="Select Target"
                  disabled={targets.length <= 1 || isSubmitting}
                  className={classNames("w-full", fieldState.invalid && "p-invalid")}
                  onChange={(e) => {
                    field.onChange(e.value)
                    // Auto-fill edit inputs when target changes
                    const selected = targets.find((t) => t.id === e.value)
                    if (selected) {
                      form.setValue("targetDisplayName", selected.displayName || selected.preferredDisplayName || "")
                    }
                  }}
                />
                <small className="text-muted-foreground">
                  {targets.length <= 1
                    ? "There are no other targets in this organization."
                    : "Select which site target this WordPress installation maps to."}
                </small>
                {fieldState.error && (
                  <small className="text-red-500 font-medium">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        {/* Edit Target Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="targetDisplayName" className="text-sm font-medium">Target Display Name</label>
          <Controller
            name="targetDisplayName"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  id={field.name}
                  disabled={isSubmitting}
                  className={classNames("w-full", fieldState.invalid && "p-invalid")}
                  {...field}
                />
                <small className="text-muted-foreground">
                  How this target appears in the SaaS dashboard.
                </small>
                {fieldState.error && (
                  <small className="text-red-500 font-medium">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        <Button
          type="submit"
          label="Save Settings"
          loading={isSubmitting}
          disabled={!form.formState.isDirty}
        />
      </form>
    </>
  )
}
