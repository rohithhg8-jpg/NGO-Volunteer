import type { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = { title: "Volunteer Registration – VolunteerHub" };

export default function VolunteerRegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl">Volunteer Registration</h1>
        <p className="mt-1 text-muted">Create an account to join community activities near you.</p>
      </div>
      <RegisterForm role="volunteer" />
    </div>
  );
}
