// components/navigation/SpecializedDropdown.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Category {
  _id: string;
  name: string;
  description: string | null;
  image: string | null;
  parent: { _id: string; name: string } | null;
  level: number;
  isActive: boolean;
  createdAt: string;
  __v: number;
}

interface SpecializedDropdownProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCloseDropdown?: () => void; // Add this prop
  isSticky?: boolean;
}

const SpecializedDropdown = ({
  onMouseEnter,
  onMouseLeave,
  onCloseDropdown, // Add this prop
  isSticky = false,
}: SpecializedDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle link click - close dropdown
  const handleLinkClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onCloseDropdown) {
      onCloseDropdown();
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://gamersbd-server.onrender.com/api/categories",
        );
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError("Error loading categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get top 3 main categories (level 0)
  const getMainCategories = () => {
    const mainCats = categories.filter((cat) => cat.level === 0);
    return mainCats.slice(0, 3);
  };

  // Get subcategories for a main category (level 1)
  const getSubcategories = (parentId: string) => {
    const subs = categories.filter((cat) => cat.parent?._id === parentId);
    return subs.slice(0, 5);
  };

  // Get icon and color based on category name
  const getCategoryTheme = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (
      name.includes("game") ||
      name.includes("gaming") ||
      name.includes("sport") ||
      name.includes("action") ||
      name.includes("adventure") ||
      name.includes("strategy") ||
      name.includes("role")
    ) {
      return {
        color: "orange",
        icon: "🎮",
        gradient: "from-orange-500 to-orange-600",
      };
    }
    if (
      name.includes("mobile") ||
      name.includes("phone") ||
      name.includes("wearable") ||
      name.includes("smart")
    ) {
      return {
        color: "orange",
        icon: "📱",
        gradient: "from-green-500 to-green-600",
      };
    }
    if (
      name.includes("audio") ||
      name.includes("camera") ||
      name.includes("electric") ||
      name.includes("head") ||
      name.includes("monitor") ||
      name.includes("media")
    ) {
      return {
        color: "orange",
        icon: "🎧",
        gradient: "from-purple-500 to-purple-600",
      };
    }
    return {
      color: "orange",
      icon: "📦",
      gradient: "from-gray-500 to-gray-600",
    };
  };

  if (loading) {
    return (
      <div
        className={`bg-[#1a1a1a] dark:bg-gray-900 max-w-7xl mx-auto shadow-2xl  ${
          isSticky ? "fixed left-0 right-0 mx-auto" : "absolute left-0 right-0"
        }`}
        style={{
          top: isSticky ? "73px" : "100%",
          zIndex: 100,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="px-6 py-12">
          <div className="flex justify-center items-center h-48">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-[#1a1a1a] dark:bg-gray-900 max-w-7xl mx-auto shadow-2xl  ${
          isSticky ? "fixed left-0 right-0 mx-auto" : "absolute left-0 right-0"
        }`}
        style={{
          top: isSticky ? "73px" : "100%",
          zIndex: 100,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="px-6 py-12">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Failed to load categories
            </p>
          </div>
        </div>
      </div>
    );
  }

  const mainCategories = getMainCategories();

  return (
    <div
      ref={dropdownRef}
      className={`bg-[#1a1a1a] dark:bg-gray-900 max-w-7xl mx-auto shadow-2xl  ${
        isSticky ? "fixed left-0 right-0 mx-auto" : "absolute left-0 right-0"
      }`}
      style={{
        top: isSticky ? "73px" : "100%",
        zIndex: 100,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-6 py-8">
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* First 3 Columns - Dynamic Categories */}
          {mainCategories.map((category, idx) => {
            const subcategories = getSubcategories(category._id);
            const theme = getCategoryTheme(category.name);
            const color = theme.color;
            const icon = theme.icon;

            return (
              <div key={category._id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3  pb-3">
                  <span className="text-2xl">{icon}</span>
                  <h4
                    className={`font-bold text-lg text-${color}-600 dark:text-${color}-400`}
                  >
                    {category.name}
                  </h4>
                </div>

                {/* Subcategories */}
                <div className="space-y-2">
                  {subcategories.map((sub) => (
                    <Link
                      key={sub._id}
                      href={`/categories/${sub._id}`}
                      onClick={handleLinkClick} // Add click handler
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-500 dark:hover:bg-gray-800 transition-all duration-200 group"
                    >
                      <span
                        className={`text-sm text-white dark:text-gray-700 group-hover:text-${color}-600 
                          dark:group-hover:text-${color}-400 transition-colors`}
                      >
                        {sub.name}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>

                {/* View All Link */}
                <div className="pt-2">
                  <Link
                    href={`/categories/${category._id}`}
                    onClick={handleLinkClick} // Add click handler
                    className="inline-flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
                  >
                    View All
                    <svg
                      className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}

          {/* 4th Column - Featured Section */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-5">
              <div className="text-4xl mb-3">⚡</div>
              <h5 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                Flash Sale
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Up to 50% off on selected items
              </p>
              <Link
                href="/offers/flash-sales"
                onClick={handleLinkClick} // Add click handler
                className="inline-flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 group"
              >
                Shop Now
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/categories"
                onClick={handleLinkClick} // Add click handler
                className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Browse All Categories
                </span>
                <svg
                  className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecializedDropdown;
