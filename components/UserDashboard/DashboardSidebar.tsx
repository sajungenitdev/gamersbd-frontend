// components/DashboardSidebar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  Heart,
  MessageCircle,
  Trophy,
  Users,
  Bell,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useUserAuth } from "../../app/contexts/UserAuthContext";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  firstName?: string;
  lastName?: string;
}

interface DashboardSidebarProps {
  user: UserData;
}

const DashboardSidebar = ({ user }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUserAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      paths: ["/dashboard"],
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      href: "/dashboard/profile",
      paths: ["/dashboard/profile", "/profile"],
    },
    {
      id: "orders",
      label: "My Orders",
      icon: ShoppingBag,
      href: "/dashboard/orders",
      paths: ["/dashboard/orders", "/orders"],
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      href: "/dashboard/wishlist",
      paths: ["/dashboard/wishlist", "/wishlist"],
    },
  ];

  // Check if a menu item is active
  const isMenuItemActive = (item: typeof menuItems[0]) => {
    return item.paths.includes(pathname) || pathname === item.href;
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getFullName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 rounded-lg text-white"
      >
        <LayoutDashboard size={20} />
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 rounded-xl h-screen w-72 my-3 bg-gradient-to-b from-[#161618] to-[#111113] 
          flex flex-col z-40 transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* User Profile Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center overflow-hidden ring-4 ring-purple-500/20">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {getUserInitials()}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[#161618]"></div>
            </div>

            {/* User Info */}
            <h3 className="text-white font-semibold text-lg">
              {getFullName()}
            </h3>
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = isMenuItemActive(item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-400 border border-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <item.icon
                    size={20}
                    className={
                      isActive
                        ? "text-purple-400"
                        : "group-hover:text-purple-400 transition-colors"
                    }
                  />
                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>
                  {isActive && (
                    <ChevronRight size={16} className="text-purple-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="group-hover:rotate-180 transition-transform duration-300"
            />
            <span className="flex-1 text-left text-sm font-medium">Logout</span>
          </button>

          {/* Version info */}
          <p className="text-xs text-gray-600 text-center mt-4">
            Version 1.0.0 | © 2026 Gamers BD
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;