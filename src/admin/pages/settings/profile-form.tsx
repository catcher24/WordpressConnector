"use client"

import { useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, Controller } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  bio: "I own a computer.",
  urls: [
    { value: "https://shadcn.com" },
    { value: "http://twitter.com/shadcn" },
  ],
}

const emailOptions = [
  { label: "m@example.com", value: "m@example.com" },
  { label: "m@google.com", value: "m@google.com" },
  { label: "m@support.com", value: "m@support.com" },
]

export function ProfileForm() {
  const toast = useRef<Toast>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  })

  function onSubmit(data: ProfileFormValues) {
    toast.current?.show({
      severity: "success",
      summary: "You submitted the following values:",
      detail: JSON.stringify(data, null, 2),
      life: 5000,
    })
  }

  return (
    <>
      <Toast ref={toast} position="top-center" />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium">Username</label>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  id={field.name}
                  placeholder="shadcn"
                  className={cn("w-full", fieldState.invalid && "p-invalid")}
                  {...field}
                />
                <small className="text-muted-foreground">
                  This is your public display name. It can be your real name or a
                  pseudonym. You can only change this once every 30 days.
                </small>
                {fieldState.error && (
                  <small className="text-red-500 font-medium">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={emailOptions}
                  placeholder="Select a verified email to display"
                  className={cn("w-full", fieldState.invalid && "p-invalid")}
                />
                <small className="text-muted-foreground">
                  You can manage verified email addresses in your{" "}
                  <a href="/examples/forms" className="underline">email settings</a>.
                </small>
                {fieldState.error && (
                  <small className="text-red-500 font-medium">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bio" className="text-sm font-medium">Bio</label>
          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <InputTextarea
                  id={field.name}
                  placeholder="Tell us a little bit about yourself"
                  autoResize
                  rows={3}
                  className={cn("w-full resize-none", fieldState.invalid && "p-invalid")}
                  {...field}
                />
                <small className="text-muted-foreground">
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </small>
                {fieldState.error && (
                  <small className="text-red-500 font-medium">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 mb-4">
              <label
                htmlFor={`urls.${index}.value`}
                className={cn("text-sm font-medium", index !== 0 && "sr-only")}
              >
                URLs
              </label>
              <small className={cn("text-muted-foreground", index !== 0 && "sr-only")}>
                Add links to your website, blog, or social media profiles.
              </small>
              <Controller
                name={`urls.${index}.value`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      className={cn("w-full", fieldState.invalid && "p-invalid")}
                      {...field}
                    />
                    {fieldState.error && (
                      <small className="text-red-500 font-medium">{fieldState.error.message}</small>
                    )}
                  </>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            label="Add URL"
            outlined
            size="small"
            className="mt-2"
            onClick={() => append({ value: "" })}
          />
        </div>

        <Button type="submit" label="Update profile" />
      </form>
    </>
  )
}
