import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ApplicationStatus } from "@/lib/types";

type Variant = "primary" | "secondary" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "border border-border bg-background text-foreground hover:bg-surface",
  danger: "border border-danger/30 bg-background text-danger hover:bg-danger-soft",
};

export function buttonClass(variant: Variant = "primary", size: "md" | "sm" = "md") {
  const sizing = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm";
  return `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${sizing} ${variantClasses[variant]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "md" | "sm" }) {
  return <button className={`${buttonClass(variant, size)} ${className}`} {...props} />;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-border bg-background p-5 ${className}`}>{children}</div>;
}

export function Alert({ type, children }: { type: "success" | "error" | "info"; children: ReactNode }) {
  const styles = {
    success: "border-primary/30 bg-primary-soft text-primary-hover",
    error: "border-danger/30 bg-danger-soft text-danger",
    info: "border-border bg-surface text-foreground",
  }[type];
  return (
    <div role={type === "error" ? "alert" : "status"} className={`rounded-md border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles = {
    Pending: "bg-warning-soft text-warning",
    Approved: "bg-primary-soft text-primary-hover",
    Rejected: "bg-danger-soft text-danger",
  }[status];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>{status}</span>;
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-balance md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-muted text-pretty">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold text-primary">{value}</p>
    </Card>
  );
}

export function LoadingState() {
  return <p className="py-12 text-center text-muted">Loading…</p>;
}
