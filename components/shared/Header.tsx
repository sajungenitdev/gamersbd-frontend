// components/Header.tsx
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const STORAGE_KEY = "cached_categories";

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check and watch for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme();

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

  // Load cached categories immediately
  const loadCachedCategories = useCallback(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired && data && data.length > 0) {
          setCategories(data);
          if (data.length > 0 && !activeCategoryTab) {
            setActiveCategoryTab(data[0].name);
          }
          setLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.error("Error loading cached categories:", err);
    }
    return false;
  }, [activeCategoryTab]);

  // Fetch categories with optimization
  const fetchCategories = useCallback(async (skipCache = false) => {
    // Don't fetch if we already have categories and not forcing refresh
    if (!skipCache && categories.length > 0) {
      return;
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      // Set a timeout for the fetch (15 seconds instead of 30)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 15000);
      });

      const fetchPromise = categoryService.getAllCategories({
        signal: abortControllerRef.current.signal
      });

      const data = await Promise.race([fetchPromise, timeoutPromise]) as any[];

      if (data && data.length > 0) {
        const tree = categoryService.buildCategoryTree(data);
        setCategories(tree);
        
        // Cache the data
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            data: tree,
            timestamp: Date.now()
          }));
        } catch (err) {
          console.error("Error caching categories:", err);
        }

        if (tree.length > 0 && !activeCategoryTab) {
          setActiveCategoryTab(tree[0].name);
        }
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted");
        return;
      }
      
      console.error("Error in fetchCategories:", err);
      setError("Failed to load categories");
      
      // Try to use cached data even if expired
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          if (data && data.length > 0) {
            setCategories(data);
            setError(null); // Clear error since we have cached data
            console.log("Using expired cached categories as fallback");
          }
        }
      } catch (cacheErr) {
        console.error("Error loading fallback cache:", cacheErr);
      }
    } finally {
      setLoading(false);
    }
  }, [categories.length, activeCategoryTab]);

  // Load categories on mount with priority
  useEffect(() => {
    // First try to load from cache immediately (synchronous)
    const hasCache = loadCachedCategories();
    
    // Then fetch fresh data in background (don't await)
    if (!hasCache) {
      fetchCategories();
    } else {
      // Still fetch fresh data in background but don't show loading
      fetchCategories(true).catch(console.error);
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadCachedCategories, fetchCategories]);

  // Handle scroll for sticky header with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (mainHeaderRef.current && topBarRef.current) {
            const topBarHeight = topBarRef.current.clientHeight;
            const scrollPosition = window.scrollY;
            setIsSticky(scrollPosition > topBarHeight);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Memoized data to prevent unnecessary re-renders
  const specialized = useMemo(() => [
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
  ], []);

  const offers = useMemo(() => [
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
  ], []);

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

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const handleMouseEnter = useCallback((dropdown: string) => {
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
  }, [categories.length, activeCategoryTab]);

  const handleMouseLeave = useCallback(() => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  // Preload dropdown content on hover (lazy loading)
  const handleCategoriesHover = useCallback(() => {
    handleMouseEnter("categories");
    // Pre-fetch any additional data if needed
  }, [handleMouseEnter]);

  return (
    <header ref={headerRef} className="relative">
      <div ref={topBarRef}>
        <TopBar />
      </div>

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

              <div
                className="hidden lg:block"
                onMouseEnter={handleCategoriesHover}
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

            <div className="navbar-center hidden lg:flex" />

            <div className="navbar-end flex items-center gap-2">
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

      {isSticky && (
        <div className="h-[73px] w-full bg-[#191919] dark:bg-white" />
      )}

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