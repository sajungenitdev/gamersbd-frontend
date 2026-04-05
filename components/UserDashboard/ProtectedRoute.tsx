// components/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../app/contexts/UserAuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: restrict to specific roles
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is not logged in
      if (!user) {
        router.push("/auth");
        return;
      }

      // Check if user has required role
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/dashboard"); // Redirect to dashboard or 403 page
        return;
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!user) {
    return null;
  }

  // Check role restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;