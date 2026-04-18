// components/Header.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { categoryService } from "../../services/categoryService";
import TopBar from "./TopBar";
import DesktopNav from "./navigation/DesktopNav";
import ExpandableSearch from "./ExpandableSearch";
import CategoriesDropdown from "./navigation/CategoriesDropdown";
import SpecializedDropdown from "./navigation/SpecializedDropdown";
import OffersDropdown from "./navigation/OffersDropdown";
import MobileMenu from "./navigation/MobileMenu";

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Add state for dark mode
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  // Check and watch for theme changes
  useEffect(() => {
    const checkTheme = () => {
      // Check for data-theme attribute (daisyui) or dark class (Tailwind)
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    // Initial check
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "data-theme" ||
          mutation.attributeName === "class"
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    // In Header.tsx - Update the fetchCategories function
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use getCategoryTree instead of getAllCategories + buildCategoryTree
        const treeData = await categoryService.getCategoryTree();

        console.log("Tree data loaded:", treeData);
        console.log("Root categories count:", treeData.length);

        if (treeData && treeData.length > 0) {
          setCategories(treeData); // Tree already has subcategories

          if (treeData.length > 0) {
            setActiveCategoryTab(treeData[0].name);
          }
        } else {
          // Fallback to flat list if tree fails
          console.log("Tree returned empty, trying flat list...");
          const flatData = await categoryService.getAllCategories();
          const tree = categoryService.buildCategoryTree(flatData);
          setCategories(tree);

          if (tree.length > 0) {
            setActiveCategoryTab(tree[0].name);
          }
        }
      } catch (err) {
        console.error("Error in fetchCategories:", err);
        setError("Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (mainHeaderRef.current && topBarRef.current) {
        const topBarHeight = topBarRef.current.clientHeight;
        const scrollPosition = window.scrollY;

        // Make header sticky when scrolled past the top bar
        setIsSticky(scrollPosition > topBarHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const specialized = [
    {
      name: "Gaming PCs",
      href: "/specialized/gaming-pcs",
      icon: "🎮",
      description: "Custom built gaming rigs",
    },
    {
      name: "Laptops",
      href: "/specialized/laptops",
      icon: "💻",
      description: "Gaming & productivity laptops",
    },
    {
      name: "Smartphones",
      href: "/specialized/smartphones",
      icon: "📱",
      description: "Latest mobile tech",
    },
    {
      name: "Cameras",
      href: "/specialized/cameras",
      icon: "📷",
      description: "DSLR & mirrorless cameras",
    },
    {
      name: "Audio",
      href: "/specialized/audio",
      icon: "🎧",
      description: "Headphones & speakers",
    },
    {
      name: "Wearables",
      href: "/specialized/wearables",
      icon: "⌚",
      description: "Smart watches & fitness trackers",
    },
    {
      name: "Drones",
      href: "/specialized/drones",
      icon: "🚁",
      description: "Aerial photography drones",
    },
    {
      name: "Accessories",
      href: "/specialized/accessories",
      icon: "🔌",
      description: "Gaming peripherals",
    },
  ];

  const offers = [
    {
      name: "Today's Deals",
      href: "/offers/todays-deals",
      badge: "🔥 Hot",
      description: "24-hour exclusive deals",
      discount: "Up to 70% off",
    },
    {
      name: "Clearance",
      href: "/offers/clearance",
      badge: "50% Off",
      description: "End of line products",
      discount: "Min 50% off",
    },
    {
      name: "Flash Sales",
      href: "/offers/flash-sales",
      badge: "Limited",
      description: "Limited time offers",
      discount: "Extra 20% off",
    },
    {
      name: "Bundle Offers",
      href: "/offers/bundles",
      badge: "Save More",
      description: "Combo deals",
      discount: "Save up to 30%",
    },
    {
      name: "Student Discount",
      href: "/offers/students",
      badge: "10% Off",
      description: "For verified students",
      discount: "Extra 10% off",
    },
    {
      name: "First Order",
      href: "/offers/first-order",
      badge: "15% Off",
      description: "New customer special",
      discount: "15% off",
    },
    {
      name: "Gift Cards",
      href: "/offers/gift-cards",
      badge: "Bonus",
      description: "Digital gift cards",
      discount: "Free $5 bonus",
    },
    {
      name: "Seasonal Sale",
      href: "/offers/seasonal",
      badge: "Up to 70%",
      description: "Season specials",
      discount: "Up to 70% off",
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  const handleMouseEnter = (dropdown: string) => {
    console.log("Mouse entered:", dropdown);
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setActiveDropdown(dropdown);
    if (
      dropdown === "categories" &&
      categories.length > 0 &&
      !activeCategoryTab
    ) {
      setActiveCategoryTab(categories[0].name);
    }
  };

  const handleMouseLeave = () => {
    console.log("Mouse left");
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <header ref={headerRef} className="relative">
      {/* TopBar with ref */}
      <div ref={topBarRef}>
        <TopBar />
      </div>

      {/* Main Header - Sticky */}
      <div
        ref={mainHeaderRef}
        className={`bg-[#191919] dark:bg-white shadow-sm transition-all duration-300 border-b border-gray-800 dark:border-gray-200 ${
          isSticky
            ? "fixed top-0 left-0 right-0 z-[60] animate-slideDown"
            : "relative"
        }`}
        style={{
          zIndex: isSticky ? 60 : 50,
          transform: isSticky ? "translateY(0)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="navbar py-3 px-0 min-h-[73px]">
            {/* Left side - Logo and Categories dropdown */}
            <div className="navbar-start flex items-center gap-2">
              <button
                className="btn btn-ghost lg:hidden text-white dark:text-gray-900"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>

              {/* Dynamic Logo based on theme */}
              <Link href="/" className="p-0 pt-2 flex items-center">
                <Image
                  src={
                    isDarkMode
                      ? "/images/logo-black.png"
                      : "/images/logo-white.png"
                  }
                  alt="Gamersbd"
                  width={isSticky ? 160 : 180}
                  height={isSticky ? 45 : 50}
                  className="h-auto w-auto transition-all duration-300 -mt-2"
                  priority
                />
              </Link>

              {/* Categories Dropdown Trigger - Only visible on desktop */}
              <div
                className="hidden lg:block"
                onMouseEnter={() => handleMouseEnter("categories")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`btn btn-ghost flex items-center gap-2 text-white dark:text-gray-900 ${
                    activeDropdown === "categories"
                      ? "bg-orange-600 dark:bg-gray-800"
                      : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span className="font-medium font-lato">CATEGORIES</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === "categories" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Center - Empty (or can be used for something else) */}
            <div className="navbar-center hidden lg:flex">
              {/* This space is intentionally left empty */}
            </div>

            {/* Right side - Navigation and Search */}
            <div className="navbar-end flex items-center gap-2">
              {/* Desktop Navigation (Specialized, Offers, Contact) */}
              <div className="hidden lg:block">
                <DesktopNav
                  activeDropdown={activeDropdown}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>

              <ExpandableSearch />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump when header becomes sticky - Only visible when sticky */}
      {isSticky && (
        <div className="h-[73px] w-full bg-[#191919] dark:bg-white" />
      )}

      {/* Dropdown Container - Fixed positioning when sticky */}
      {/* Dropdown Container */}
      {(activeDropdown === "categories" ||
        activeDropdown === "specialized" ||
        activeDropdown === "offers") && (
        <div
          className={`left-0 right-0 transition-all duration-300 ${
            isSticky ? "fixed z-[61]" : "absolute z-[100]"
          }`}
          style={{
            top: isSticky ? "73px" : "100%",
          }}
        >
          {activeDropdown === "categories" && !loading && (
            <CategoriesDropdown
              categories={categories}
              activeCategoryTab={activeCategoryTab}
              onCategoryChange={setActiveCategoryTab}
              onMouseEnter={() => handleMouseEnter("categories")}
              onMouseLeave={handleMouseLeave}
              onCloseDropdown={closeAllDropdowns}
              isSticky={isSticky}
            />
          )}

          {activeDropdown === "specialized" && (
            <SpecializedDropdown
              onMouseEnter={() => handleMouseEnter("specialized")}
              onMouseLeave={handleMouseLeave}
              onCloseDropdown={closeAllDropdowns}
              isSticky={isSticky}
            />
          )}

          {activeDropdown === "offers" && (
            <OffersDropdown
              onMouseEnter={() => handleMouseEnter("offers")}
              onMouseLeave={handleMouseLeave}
              onCloseDropdown={closeAllDropdowns}
              isSticky={isSticky}
            />
          )}
        </div>
      )}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        categories={categories}
        specialized={specialized}
        offers={offers}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
