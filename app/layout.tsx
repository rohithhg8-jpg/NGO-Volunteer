import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "VolunteerHub – NGO Volunteer Management System",
  description:
    "VolunteerHub connects volunteers with NGO coordinators. Join community activities or manage volunteer registrations in one simple place.",
};

export const viewport: Viewport = {
  themeColor: "#1f7a4d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted">
          VolunteerHub – a college community project
        </footer>
      </body>
    </html>
  );
}
