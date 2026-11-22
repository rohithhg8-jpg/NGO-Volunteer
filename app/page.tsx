import Link from "next/link";
import { buttonClass, Card } from "@/components/ui";

const steps = [
  { title: "Coordinators post activities", text: "NGO coordinators create community activities with date, location and volunteers needed." },
  { title: "Volunteers join", text: "Volunteers browse available activities and send a request to join with one click." },
  { title: "Coordinators review", text: "Coordinators approve or reject applications, and volunteers see their status instantly." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-start gap-6 rounded-lg bg-primary-soft px-6 py-12 md:px-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">NGO Volunteer Management System</p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-balance md:text-5xl">
          Connecting volunteers with community work that matters.
        </h1>
        <p className="max-w-2xl text-lg text-muted text-pretty">
          VolunteerHub helps NGO coordinators organise community activities and helps volunteers find
          and join them — all in one simple place.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/register/volunteer" className={buttonClass()}>
            Volunteer Registration
          </Link>
          <Link href="/register/coordinator" className={buttonClass("secondary")}>
            Coordinator Registration
          </Link>
          <Link href="/login" className={buttonClass("secondary")}>
            Login
          </Link>
        </div>
      </section>

      <section aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="mb-6 text-2xl font-bold">
          How it works
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="demo-accounts">
        <Card className="bg-surface">
          <h2 id="demo-accounts" className="font-semibold">
            Try it with demo accounts
          </h2>
          <p className="mt-1 text-sm text-muted">
            Sample activities are included. You can register your own accounts, or log in with:
          </p>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            <li>
              <strong>Coordinator:</strong> coordinator@demo.org / demo1234
            </li>
            <li>
              <strong>Volunteer:</strong> volunteer@demo.org / demo1234
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
