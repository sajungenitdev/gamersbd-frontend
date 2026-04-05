// components/navigation/MobileMenu.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: Category[];
}

interface MobileMenuProps {
  isOpen: boolean;
  categories: Category[];
  specialized: any[];
  offers: any[];
  onClose?: () => void; // Add optional onClose prop
}

const MobileMenu = ({
  isOpen,
  categories,
  specialized,
  offers,
  onClose,
}: MobileMenuProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(
    null,
  );

  if (!isOpen) return null;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedSubCategory(null); // Reset subcategory expansion
  };

  const toggleSubCategory = (subId: string) => {
    setExpandedSubCategory(expandedSubCategory === subId ? null : subId);
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
        style={{ zIndex: 97 }}
        onClick={handleLinkClick}
      />
      
      <div
        className="lg:hidden bg-base-100 shadow-sm border-t border-base-200 max-h-[80vh] overflow-y-auto fixed bottom-0 left-0 right-0 rounded-t-2xl"
        style={{ zIndex: 98 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header with close button */}
          <div className="sticky top-0 bg-base-100 border-b border-base-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={handleLinkClick}
              className="btn btn-circle btn-ghost btn-sm"
              aria-label="Close menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Mobile Categories */}
            <div>
              <h3 className="font-bold text-lg mb-2 px-2 flex items-center gap-2">
                <span>📋</span> CATEGORIES
              </h3>
              <div className="space-y-1">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category._id}
                      className="border-b border-base-200 last:border-0"
                    >
                      <button
                        onClick={() => toggleCategory(category._id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-base-200 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{category.icon}</span>
                          <div className="text-left">
                            <span className="font-medium block">
                              {category.name}
                            </span>
                            <span className="text-xs text-base-content/60">
                              {category.subcategories.length} subcategories
                            </span>
                          </div>
                        </div>
                        {category.subcategories.length > 0 && (
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedCategory === category._id ? "rotate-180" : ""
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
                        )}
                      </button>

                      {/* Subcategories */}
                      {expandedCategory === category._id &&
                        category.subcategories.length > 0 && (
                          <div className="ml-12 mt-1 space-y-1 pb-2">
                            {category.subcategories.map((sub) => (
                              <div key={sub._id}>
                                <button
                                  onClick={() => toggleSubCategory(sub._id)}
                                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-base-200 transition-colors text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{sub.icon}</span>
                                    <span>{sub.name}</span>
                                  </div>
                                  {sub.subcategories.length > 0 && (
                                    <svg
                                      className={`w-4 h-4 transition-transform ${
                                        expandedSubCategory === sub._id
                                          ? "rotate-180"
                                          : ""
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
                                  )}
                                </button>

                                {/* Level 2 subcategories */}
                                {expandedSubCategory === sub._id &&
                                  sub.subcategories.length > 0 && (
                                    <div className="ml-8 mt-1 space-y-1">
                                      {sub.subcategories.map((level2) => (
                                        <Link
                                          key={level2._id}
                                          href={`/category/${level2._id}`}
                                          onClick={handleLinkClick}
                                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 transition-colors text-sm"
                                        >
                                          <span className="text-base">
                                            {level2.icon}
                                          </span>
                                          <span>{level2.name}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  )}

                                {/* Direct link to subcategory */}
                                {expandedSubCategory !== sub._id && (
                                  <Link
                                    href={`/category/${sub._id}`}
                                    onClick={handleLinkClick}
                                    className="block p-2 ml-6 text-xs text-primary hover:text-primary/80"
                                  >
                                    View all {sub.name} →
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Direct link to category */}
                      {expandedCategory !== category._id && (
                        <Link
                          href={`/category/${category._id}`}
                          onClick={handleLinkClick}
                          className="block p-2 ml-12 text-xs text-primary hover:text-primary/80"
                        >
                          View all {category.name} →
                        </Link>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-base-content/60">
                    <p>No categories available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Specialized */}
            <div>
              <h3 className="font-bold text-lg mb-2 px-2 flex items-center gap-2">
                <span>⚡</span> SPECIALIZED
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {specialized.length > 0 ? (
                  specialized.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-base-200 transition-colors border border-base-200"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-base-content/60">
                    <p>No specialized items</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Offers */}
            <div>
              <h3 className="font-bold text-lg mb-2 px-2 flex items-center gap-2">
                <span>🏷️</span> OFFERS
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {offers.length > 0 ? (
                  offers.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors border border-base-200"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="badge badge-primary badge-sm">
                        {item.badge}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-base-content/60">
                    <p>No offers available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;