"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { registerUser } from "@/lib/actions";
import { EMAIL_PATTERN, isValidPhone } from "@/lib/format";
import type { Role } from "@/lib/types";
import { FormField } from "./form-field";
import { Alert, Button, Card } from "./ui";

type Values = Record<
  "fullName" | "email" | "phone" | "password" | "confirmPassword" | "location" | "organization",
  string
>;

const emptyValues: Values = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  location: "",
  organization: "",
};

function validate(values: Values, role: Role) {
  const errors: Partial<Values> = {};
  if (!values.fullName.trim()) errors.fullName = "Full name is required.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (!isValidPhone(values.phone)) errors.phone = "Enter a valid phone number (10–13 digits).";
  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match.";
  if (role === "volunteer" && !values.location.trim()) errors.location = "Location is required.";
  if (role === "coordinator" && !values.organization.trim())
    errors.organization = "NGO / organization name is required.";
  return errors;
}

export function RegisterForm({ role }: { role: Role }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof Values) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    const nextErrors = validate(values, role);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    const result = await registerUser({ role, ...values });
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    router.push(`/${role}/dashboard?welcome=1`);
  }

  return (
    <Card className="mx-auto w-full max-w-lg p-6 md:p-8">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && <Alert type="error">{formError}</Alert>}

        <FormField id="fullName" label="Full name" autoComplete="name" value={values.fullName} onChange={update("fullName")} error={errors.fullName} />
        <FormField id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={update("email")} error={errors.email} />
        <FormField id="phone" label="Phone number" type="tel" autoComplete="tel" value={values.phone} onChange={update("phone")} error={errors.phone} />

        {role === "volunteer" ? (
          <FormField id="location" label="Location (city / area)" autoComplete="address-level2" value={values.location} onChange={update("location")} error={errors.location} />
        ) : (
          <FormField id="organization" label="NGO / organization name" autoComplete="organization" value={values.organization} onChange={update("organization")} error={errors.organization} />
        )}

        <FormField id="password" label="Password" type="password" autoComplete="new-password" hint="At least 6 characters." value={values.password} onChange={update("password")} error={errors.password} />
        <FormField id="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={update("confirmPassword")} error={errors.confirmPassword} />

        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </Card>
  );
}
