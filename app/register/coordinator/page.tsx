import type { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = { title: "Coordinator Registration – VolunteerHub" };

export default function CoordinatorRegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl">Coordinator Registration</h1>
        <p className="mt-1 text-muted">Register your NGO to create activities and manage volunteers.</p>
      </div>
      <RegisterForm role="coordinator" />
    </div>
  );
}
