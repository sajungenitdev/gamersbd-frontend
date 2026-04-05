// components/AuthGuard.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserAuth } from "../../app/contexts/UserAuthContext";

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useUserAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push("/auth");
        } else if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.push("/dashboard");
        }
      }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}