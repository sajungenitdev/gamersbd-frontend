// app/dashboard/DashboardWrapper.tsx
"use client";
import { UserAuthProvider } from "../../contexts/UserAuthContext";
import DashboardClient from "./DashboardClient";

export default function DashboardWrapper() {
  return (
    <UserAuthProvider>
      <DashboardClient />
    </UserAuthProvider>
  );
}
