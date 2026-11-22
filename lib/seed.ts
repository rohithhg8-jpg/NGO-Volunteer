import type { Activity, Application, User } from "./types";

export const DEMO_PASSWORD = "demo1234";
const DEMO_PASSWORD_HASH = "0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d";

export const DEMO_COORDINATOR_EMAIL = "coordinator@demo.org";
export const DEMO_VOLUNTEER_EMAIL = "volunteer@demo.org";

function daysFromToday(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function buildSeedData(): { users: User[]; activities: Activity[]; applications: Application[] } {
  const now = new Date().toISOString();

  const users: User[] = [
    {
      id: "user_demo_coordinator",
      role: "coordinator",
      fullName: "Priya Sharma",
      email: DEMO_COORDINATOR_EMAIL,
      phone: "9876543210",
      organization: "Green Earth Foundation",
      passwordHash: DEMO_PASSWORD_HASH,
      createdAt: now,
    },
    {
      id: "user_demo_volunteer",
      role: "volunteer",
      fullName: "Arjun Mehta",
      email: DEMO_VOLUNTEER_EMAIL,
      phone: "9123456780",
      location: "Bengaluru",
      passwordHash: DEMO_PASSWORD_HASH,
      createdAt: now,
    },
  ];

  const activities: Activity[] = [
    {
      id: "activity_demo_1",
      coordinatorId: "user_demo_coordinator",
      title: "Lakeside Clean-up Drive",
      description:
        "Help remove plastic waste and debris from the lake shore. Gloves, bags and refreshments will be provided. Please wear comfortable clothes and closed shoes.",
      date: daysFromToday(7),
      location: "Ulsoor Lake, Bengaluru",
      volunteersRequired: 20,
      createdAt: now,
    },
    {
      id: "activity_demo_2",
      coordinatorId: "user_demo_coordinator",
      title: "Weekend Tutoring for Children",
      description:
        "Teach basic maths and English to primary school children at a community centre. No prior teaching experience required, just patience and enthusiasm.",
      date: daysFromToday(10),
      location: "Community Centre, Jayanagar",
      volunteersRequired: 8,
      createdAt: now,
    },
    {
      id: "activity_demo_3",
      coordinatorId: "user_demo_coordinator",
      title: "Tree Plantation Campaign",
      description:
        "Join us in planting 200 saplings along the city outskirts. Volunteers will work in small teams, each guided by a team lead.",
      date: daysFromToday(14),
      location: "Hennur Road, Bengaluru",
      volunteersRequired: 30,
      createdAt: now,
    },
  ];

  const applications: Application[] = [
    {
      id: "application_demo_1",
      activityId: "activity_demo_2",
      volunteerId: "user_demo_volunteer",
      status: "Pending",
      appliedAt: now,
    },
  ];

  return { users, activities, applications };
}
