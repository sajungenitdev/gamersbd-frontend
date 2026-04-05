// components/navigation/CategoriesDropdown.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string | null;
  subcategories: Category[];
}

interface CategoriesDropdownProps {
  categories: Category[];
  activeCategoryTab: string;
  onCategoryChange: (category: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCloseDropdown?: () => void; // Add this prop for closing the dropdown
  isSticky?: boolean;
}

const CategoriesDropdown = ({
  categories,
  activeCategoryTab,
  onCategoryChange,
  onMouseEnter,
  onMouseLeave,
  onCloseDropdown,
  isSticky = false,
}: CategoriesDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownHeight, setDropdownHeight] = useState<number | null>(null);

  useEffect(() => {
    console.log(
      "CategoriesDropdown rendered with categories:",
      categories.length,
    );
  }, [categories]);

  // Adjust dropdown position based on sticky header
  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.offsetHeight);
    }
  }, [categories, activeCategoryTab]);

  // Helper function to create slug from category name
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle link click - close dropdown
  const handleLinkClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onCloseDropdown) {
      onCloseDropdown();
    }
  };

  const hasCategories = categories.length > 0;
  const activeCategory = hasCategories
    ? categories.find((cat) => cat.name === activeCategoryTab) || categories[0]
    : null;

  if (!hasCategories) {
    return (
      <div
        ref={dropdownRef}
        className={`bg-[#2a2a2a] dark:bg-[#f5f5f5] shadow-xl border-t border-[#3a3a3a] dark:border-gray-300 py-12 max-w-7xl mx-auto px-4 transition-all duration-300 ${
          isSticky ? "fixed left-0 right-0 mx-auto" : ""
        }`}
        style={{
          top: isSticky ? "73px" : "auto",
          zIndex: 100,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="text-center py-16 bg-[#333333] dark:bg-gray-100 rounded-lg border border-dashed border-[#444444] dark:border-gray-300">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-bold font-lato mb-2 text-white dark:text-[#2a2a2a]">
            No Categories Found
          </h3>
          <p className="text-gray-300 dark:text-gray-600 mb-6">
            There are no categories available at the moment.
          </p>
          <Link
            href="/"
            onClick={handleLinkClick}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-lato font-medium rounded-lg transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className={`bg-[#2a2a2a] dark:bg-[#f5f5f5] shadow-xl border-t border-[#3a3a3a] dark:border-gray-300 py-8 max-w-7xl mx-auto px-4 transition-all duration-300 ${
        isSticky ? "fixed left-0 right-0 mx-auto" : ""
      }`}
      style={{
        top: isSticky ? "73px" : "auto",
        zIndex: 100,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex gap-8">
        {/* Left Sidebar - Root Categories */}
        <div className="w-1/4 border-r border-[#3a3a3a] dark:border-gray-300 pr-6">
          <h3 className="font-bold font-lato text-sm tracking-wider text-gray-400 dark:text-gray-500 mb-4 px-3 uppercase">
            Categories
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => {
                  onCategoryChange(category.name);
                  // Don't close dropdown when just changing category view
                }}
                onMouseEnter={() => onCategoryChange(category.name)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  activeCategoryTab === category.name
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 dark:text-[#2a2a2a] hover:bg-[#333333] dark:hover:bg-gray-200"
                }`}
              >
                <span className="font-medium font-lato">{category.name}</span>
                {category.subcategories.length > 0 && (
                  <svg
                    className={`w-4 h-4 float-right mt-1 transition-all ${
                      activeCategoryTab === category.name
                        ? "text-white translate-x-0.5"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-300 dark:group-hover:text-[#2a2a2a]"
                    }`}
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
                )}
              </button>
            ))}
          </div>

          <Link
            href="/all-categories"
            onClick={handleLinkClick}
            className="flex items-center justify-between mt-6 px-3 py-2 text-sm text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-600 font-medium border-t border-[#3a3a3a] dark:border-gray-300 pt-4 group"
          >
            <span>View All Categories</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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

        {/* Right Side - Subcategories with CLEAN URLs */}
        <div className="w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold font-lato text-lg text-white dark:text-[#2a2a2a]">
              {activeCategoryTab}
            </h3>
            {activeCategory && (
              <Link
                href={`/category/${createSlug(activeCategory.name)}`}
                onClick={handleLinkClick}
                className="text-sm text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-700 flex items-center gap-1 group"
              >
                View All
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
            )}
          </div>

          {activeCategory && (
            <>
              {activeCategory.subcategories.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {activeCategory.subcategories.map((sub) => (
                    <Link
                      key={sub._id}
                      href={`/${sub.name.toLowerCase().replace(/\s+/g, '')}/${sub._id}`}
                      onClick={handleLinkClick}
                      className="p-4 rounded-lg bg-[#333333] dark:bg-gray-100 hover:bg-[#3a3a3a] dark:hover:bg-gray-200 transition-all duration-200 border border-[#3a3a3a] dark:border-gray-300 hover:border-blue-600/50 dark:hover:border-blue-400/50 group"
                    >
                      <span className="font-medium block text-white dark:text-[#2a2a2a] group-hover:text-blue-400 dark:group-hover:text-blue-600 transition-colors">
                        {sub.name}
                      </span>

                      {sub.description && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                          {sub.description.substring(0, 60)}
                          {sub.description.length > 60 ? "..." : ""}
                        </span>
                      )}

                      {sub.image && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Has image</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#333333] dark:bg-gray-100 rounded-lg border border-dashed border-[#444444] dark:border-gray-300">
                  <div className="text-4xl mb-3">📦</div>
                  <h4 className="font-medium text-lg mb-1 text-white dark:text-[#2a2a2a]">
                    {activeCategory.name}
                  </h4>
                  <p className="text-sm text-gray-300 dark:text-gray-600 mb-2 max-w-md mx-auto">
                    {activeCategory.description || "No description available"}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                    No subcategories found
                  </p>
                  <Link
                    href={`/category/${createSlug(activeCategory.name)}`}
                    onClick={handleLinkClick}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Browse {activeCategory.name}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesDropdown;