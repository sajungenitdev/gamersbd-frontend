// app/dashboard/DashboardClient.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "../../../components/UserDashboard/Dashboard";
import { useUserAuth } from "../../contexts/UserAuthContext";

interface DashboardClientProps {
  initialUser?: any;
}

export default function DashboardClient({ initialUser }: DashboardClientProps) {
  const {
    user: authUser,
    isLoading: authLoading,
    logout: authLogout,
  } = useUserAuth();
  const router = useRouter();
  const [user, setUser] = useState(initialUser || authUser);

  // Create async wrapper for logout
  const handleLogout = async (): Promise<void> => {
    authLogout(); // Call the sync logout
    router.push("/");
  };

  useEffect(() => {
    if (!authLoading && !authUser && !initialUser) {
      router.push("/");
    }
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser, authLoading, initialUser, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="">
      <Dashboard user={user} logout={handleLogout} />
    </div>
  );
}
