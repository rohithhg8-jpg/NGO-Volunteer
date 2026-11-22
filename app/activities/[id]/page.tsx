import type { Metadata } from "next";
import { ActivityDetails } from "@/components/activity-details";

export const metadata: Metadata = { title: "Activity Details – VolunteerHub" };

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ActivityDetails id={id} />;
}
