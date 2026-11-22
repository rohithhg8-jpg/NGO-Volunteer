"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/actions";
import { EMAIL_PATTERN } from "@/lib/format";
import type { Role } from "@/lib/types";
import { FormField } from "./form-field";
import { Alert, Button, Card } from "./ui";

const roles: { value: Role; label: string }[] = [
  { value: "volunteer", label: "Volunteer" },
  { value: "coordinator", label: "Coordinator" },
];

export function LoginForm({ loggedOut }: { loggedOut: boolean }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("volunteer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const result = await login(email, password, role);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    router.push(`/${role}/dashboard`);
  }

  return (
    <Card className="mx-auto w-full max-w-md p-6 md:p-8">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {loggedOut && !formError && <Alert type="success">You have been logged out successfully.</Alert>}
        {formError && <Alert type="error">{formError}</Alert>}

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium">I am logging in as a</legend>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${
                  role === option.value
                    ? "border-primary bg-primary-soft text-primary-hover"
                    : "border-border hover:bg-surface"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="accent-primary"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
        />

        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? "Logging in…" : "Login"}
        </Button>

        <p className="text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register/volunteer" className="font-medium text-primary hover:underline">
            Register as volunteer
          </Link>{" "}
          or{" "}
          <Link href="/register/coordinator" className="font-medium text-primary hover:underline">
            coordinator
          </Link>
        </p>
      </form>
    </Card>
  );
}
