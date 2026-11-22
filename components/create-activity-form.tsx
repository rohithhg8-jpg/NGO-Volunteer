"use client";

import { useState, type FormEvent } from "react";
import { createActivity } from "@/lib/actions";
import { todayIso } from "@/lib/format";
import { FormField, TextAreaField } from "./form-field";
import { Alert, Button } from "./ui";

type Values = { title: string; description: string; date: string; location: string; volunteersRequired: string };
const emptyValues: Values = { title: "", description: "", date: "", location: "", volunteersRequired: "" };

export function CreateActivityForm({ onCreated }: { onCreated?: () => void }) {
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update(field: keyof Values) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);

    const nextErrors: Partial<Values> = {};
    const count = Number(values.volunteersRequired);
    if (!values.title.trim()) nextErrors.title = "Title is required.";
    if (!values.description.trim()) nextErrors.description = "Description is required.";
    if (!values.date) nextErrors.date = "Date is required.";
    else if (values.date < todayIso()) nextErrors.date = "Date cannot be in the past.";
    if (!values.location.trim()) nextErrors.location = "Location is required.";
    if (!values.volunteersRequired) nextErrors.volunteersRequired = "Number of volunteers is required.";
    else if (!Number.isInteger(count) || count < 1 || count > 1000)
      nextErrors.volunteersRequired = "Enter a whole number between 1 and 1000.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setMessage({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    const result = createActivity({ ...values, volunteersRequired: count });
    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setValues(emptyValues);
    setMessage({ type: "success", text: `"${result.data.title}" has been created and is now visible to volunteers.` });
    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {message && <Alert type={message.type}>{message.text}</Alert>}
      <FormField id="title" label="Activity title" value={values.title} onChange={update("title")} error={errors.title} />
      <TextAreaField id="description" label="Description" value={values.description} onChange={update("description")} error={errors.description} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="date" label="Date" type="date" min={todayIso()} value={values.date} onChange={update("date")} error={errors.date} />
        <FormField
          id="volunteersRequired"
          label="Volunteers required"
          type="number"
          min={1}
          max={1000}
          inputMode="numeric"
          value={values.volunteersRequired}
          onChange={update("volunteersRequired")}
          error={errors.volunteersRequired}
        />
      </div>
      <FormField id="location" label="Location" value={values.location} onChange={update("location")} error={errors.location} />
      <Button type="submit" className="self-start">
        Create Activity
      </Button>
    </form>
  );
}
