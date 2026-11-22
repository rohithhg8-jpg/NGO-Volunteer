import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Login – VolunteerHub" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ loggedOut?: string }> }) {
  const { loggedOut } = await searchParams;
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl">Login</h1>
        <p className="mt-1 text-muted">Select your role and enter your account details.</p>
      </div>
      <LoginForm loggedOut={loggedOut === "1"} />
    </div>
  );
}
