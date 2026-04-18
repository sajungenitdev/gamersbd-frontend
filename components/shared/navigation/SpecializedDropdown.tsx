// components/navigation/SpecializedDropdown.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";

interface Category {
  _id: string;
  name: string;
  description: string | null;
  image: string | null;
  parent: string | null; // Changed from object to string
  level: number;
  isActive: boolean;
  order?: number;
  slug?: string;
  createdAt?: string;
}

interface CategoryWithSubs extends Category {
  subcategories: CategoryWithSubs[];
}

interface SpecializedDropdownProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCloseDropdown?: () => void;
  isSticky?: boolean;
}

// Global cache
let cachedCategories: Category[] | null = null;
let cachedTree: CategoryWithSubs[] | null = null;
let fetchStarted = false;
let fetchPromise: Promise<CategoryWithSubs[]> | null = null;

const SpecializedDropdown = ({
  onMouseEnter,
  onMouseLeave,
  onCloseDropdown,
  isSticky = false,
}: SpecializedDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [categoryTree, setCategoryTree] = useState<CategoryWithSubs[]>(
    cachedTree || [],
  );
  const [loading, setLoading] = useState(!cachedTree && !fetchStarted);
  const [error, setError] = useState<string | null>(null);

  const handleLinkClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onCloseDropdown) {
      onCloseDropdown();
    }
  };

  // Build category tree from flat data
  const buildCategoryTree = (categories: Category[]): CategoryWithSubs[] => {
    if (!categories || categories.length === 0) return [];

    const map = new Map<string, CategoryWithSubs>();
    const roots: CategoryWithSubs[] = [];

    // First pass: create map
    categories.forEach(cat => {
      map.set(cat._id, {
        ...cat,
        subcategories: []
      });
    });

    // Second pass: build hierarchy
    categories.forEach(cat => {
      const node = map.get(cat._id);
      if (!node) return;

      if (cat.parent && map.has(cat.parent)) {
        const parent = map.get(cat.parent);
        if (parent) {
          parent.subcategories.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort roots by order or name
    roots.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Sort subcategories
    roots.forEach(root => {
      if (root.subcategories.length > 0) {
        root.subcategories.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    });

    return roots;
  };

  // Fetch categories and build tree
  useEffect(() => {
    // If we already have cached tree, use it
    if (cachedTree && cachedTree.length > 0) {
      setCategoryTree(cachedTree);
      setLoading(false);
      return;
    }

    // If fetch already started, wait for it
    if (fetchStarted && fetchPromise) {
      fetchPromise
        .then((tree) => {
          setCategoryTree(tree);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch failed:", err);
          setError("Failed to load categories");
          setLoading(false);
        });
      return;
    }

    // Start fetch
    const fetchCategories = async () => {
      fetchStarted = true;
      setLoading(true);

      fetchPromise = (async () => {
        try {
          console.log("Fetching categories for specialized dropdown...");

          // Try to get tree endpoint first (faster)
          let response = await fetch("https://gamersbd-server.onrender.com/api/categories/tree", {
            headers: { Accept: "application/json" },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
              console.log(`Loaded ${result.data.length} root categories with subcategories`);
              cachedTree = result.data;
              return result.data;
            }
          }

          // Fallback to flat list and build tree
          console.log("Falling back to flat categories...");
          response = await fetch("https://gamersbd-server.onrender.com/api/categories", {
            headers: { Accept: "application/json" },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          let categories: Category[] = [];

          if (result.success && Array.isArray(result.data)) {
            categories = result.data;
          } else if (Array.isArray(result)) {
            categories = result;
          }

          if (categories.length === 0) {
            throw new Error("No categories found");
          }

          cachedCategories = categories;
          const tree = buildCategoryTree(categories);
          cachedTree = tree;
          
          console.log(`Built tree with ${tree.length} root categories`);
          return tree;
        } catch (err) {
          console.error("Error fetching categories:", err);
          throw err;
        }
      })();

      try {
        const tree = await fetchPromise;
        setCategoryTree(tree);
        setError(null);
      } catch (err) {
        if (cachedTree) {
          setCategoryTree(cachedTree);
          setError(null);
        } else {
          setError("Unable to load categories. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get categories to display (first 3 root categories with their subs)
  const displayCategories = useMemo(() => {
    // Filter to only show categories that have subcategories or are popular
    // Take first 3 root categories that have subcategories
    const categoriesWithSubs = categoryTree.filter(cat => cat.subcategories && cat.subcategories.length > 0);
    
    if (categoriesWithSubs.length >= 3) {
      return categoriesWithSubs.slice(0, 3);
    }
    
    // If not enough with subs, take first 3 root categories
    return categoryTree.slice(0, 3);
  }, [categoryTree]);

  const getCategoryIcon = (categoryName: string): string => {
    const name = categoryName.toLowerCase();
    const iconMap: Record<string, string> = {
      'electrics': '🔌',
      'electronics': '💻',
      'gaming': '🎮',
      'mobile': '📱',
      'phone': '📱',
      'audio': '🎧',
      'headphone': '🎧',
      'camera': '📷',
      'monitor': '🖥️',
      'laptop': '💻',
      'accessories': '🔌',
      'wearable': '⌚',
      'smart': '📱',
      'today': '🔥',
      'flash': '⚡',
      'bundle': '📦',
      'gift': '🎁',
      'card': '💳',
      'sale': '🏷️',
      'deal': '💰'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) {
        return icon;
      }
    }
    return '📦';
  };

  const getCategoryColor = (categoryName: string): string => {
    const name = categoryName.toLowerCase();
    if (name.includes('game') || name.includes('gaming')) return 'orange';
    if (name.includes('mobile') || name.includes('phone')) return 'green';
    if (name.includes('audio') || name.includes('head')) return 'purple';
    if (name.includes('sale') || name.includes('deal')) return 'red';
    if (name.includes('electric')) return 'blue';
    return 'orange';
  };

  const refreshCategories = async () => {
    cachedCategories = null;
    cachedTree = null;
    fetchStarted = false;
    fetchPromise = null;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://gamersbd-server.onrender.com/api/categories/tree");
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        cachedTree = result.data;
        setCategoryTree(result.data);
        setError(null);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("Error refreshing categories:", err);
      setError("Failed to refresh categories");
      if (cachedTree) {
        setCategoryTree(cachedTree);
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !cachedTree) {
    return (
      <div
        className={`bg-[#1a1a1a] dark:bg-gray-900 shadow-2xl ${
          isSticky ? "fixed left-0 right-0 mx-auto" : "absolute left-0 right-0"
        }`}
        style={{
          top: isSticky ? "73px" : "100%",
          zIndex: 100,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center h-48">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && (!cachedTree || cachedTree.length === 0)) {
    return (
      <div
        className={`bg-[#1a1a1a] dark:bg-gray-900 shadow-2xl ${
          isSticky ? "fixed left-0 right-0 mx-auto" : "absolute left-0 right-0"
        }`}
        style={{
          top: isSticky ? "73px" : "100%",
          zIndex: 100,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">
              {error}
            </p>
            <button
              onClick={refreshCategories}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (displayCategories.length === 0 && !loading) {
    return (
      <div
        className={`bg-[#1a1a1a] dark:bg-gray-900 shadow-2xl ${
          isSticky ? "fixed left-0 right-0 mx-auto" : "absolute left-0 right-0"
        }`}
        style={{
          top: isSticky ? "73px" : "100%",
          zIndex: 100,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-gray-500">No categories available</p>
            <button
              onClick={refreshCategories}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className={`bg-[#1a1a1a] dark:bg-gray-900 shadow-2xl ${
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Dynamic Categories from API */}
          {displayCategories.map((category) => {
            const icon = getCategoryIcon(category.name);
            const color = getCategoryColor(category.name);
            const subcategories = category.subcategories || [];

            return (
              <div key={category._id} className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-700 dark:border-gray-200">
                  <span className="text-2xl">{icon}</span>
                  <h4 className={`font-bold text-lg text-${color}-600 dark:text-${color}-400`}>
                    {category.name}
                  </h4>
                  {subcategories.length > 0 && (
                    <span className="text-xs text-gray-500">
                      ({subcategories.length})
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {subcategories.slice(0, 6).map((sub) => (
                    <Link
                      key={sub._id}
                      href={`/category/${sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={handleLinkClick}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/10 dark:hover:bg-gray-800 transition-all duration-200 group"
                    >
                      <span className="text-sm text-gray-300 dark:text-gray-600 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {sub.name}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform"
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

                {subcategories.length > 6 && (
                  <div className="pt-2">
                    <Link
                      href={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={handleLinkClick}
                      className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-orange-600 transition-colors group"
                    >
                      View All ({subcategories.length})
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
                )}
              </div>
            );
          })}

          {/* Promo Card - Always show */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg p-5 text-white">
              <div className="text-4xl mb-3">⚡</div>
              <h5 className="font-bold text-white text-lg mb-2">
                Flash Sale
              </h5>
              <p className="text-sm text-orange-100 mb-4">
                Up to 50% off on selected items
              </p>
              <Link
                href="/offers/flash-sales"
                onClick={handleLinkClick}
                className="inline-flex items-center text-sm font-medium text-white hover:text-orange-200 group"
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
                onClick={handleLinkClick}
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