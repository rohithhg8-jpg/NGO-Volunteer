# VolunteerHub – NGO Volunteer Management System

A simple web app that connects volunteers with NGO coordinators. Coordinators create community
activities and review applications; volunteers join activities and track their application status.

The repository contains:

- **Root (Next.js app)** – the full VolunteerHub app, built with Next.js (App Router), TypeScript
  and Tailwind CSS. Data is stored in the browser's localStorage, so no database or paid service
  is needed.
- **`Frontend/`** – a React application powered by Vite, set up as an npm workspace.
- **`Backend/`** – a placeholder for future server-side code.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the Next.js app.

To run the Vite frontend instead:

```bash
npm run frontend:dev
```

Vite prints the local development URL after the server starts.

## Production

```bash
# Next.js app
npm run build
npm run start

# Vite frontend
npm run frontend:build
npm run frontend:preview
```

`npm run frontend:start` starts the Vite development server. The `frontend:*` scripts forward to
the `Frontend` workspace.

## Demo accounts

Sample activities are seeded on first load. You can register new accounts or use:

| Role        | Email                 | Password |
| ----------- | --------------------- | -------- |
| Coordinator | coordinator@demo.org  | demo1234 |
| Volunteer   | volunteer@demo.org    | demo1234 |

To reset all data, clear the site's localStorage in your browser's developer tools.

## Pages

| Route                     | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `/`                       | Home page                                      |
| `/register/volunteer`     | Volunteer registration                         |
| `/register/coordinator`   | Coordinator registration                       |
| `/login`                  | Login with role selection                      |
| `/volunteer/dashboard`    | Browse/join activities, see application status |
| `/coordinator/dashboard`  | Create activities, approve/reject applications |
| `/activities/[id]`        | Activity details (join or manage applicants)   |

## Project structure

```
app/          Pages (App Router)
components/   Reusable UI components (forms, tables, cards, navbar)
lib/
  types.ts    Data types (User, Activity, Application)
  storage.ts  localStorage read/write + change subscription
  actions.ts  Business logic (register, login, create, join, approve/reject)
  seed.ts     Demo data
Frontend/     Vite + React frontend (npm workspace)
Backend/      Reserved for server-side code
```

## Moving to a real database later

All reads and writes go through `lib/storage.ts` and `lib/actions.ts`. To use a real database,
replace the functions in `lib/actions.ts` with API calls (e.g. Next.js Route Handlers or Server
Actions backed by Postgres) and load data from the server instead of `useDatabase()`.
The UI components do not need to change.

> Note: localStorage is for demonstration only. Passwords are hashed with SHA-256 in the browser,
> but this is not secure authentication. Use a proper auth library and server-side database before
> using the app with real users.
