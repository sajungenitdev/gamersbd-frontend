"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | Blob | undefined;
  parent: { _id: string; name: string } | null;
  level: number;
  isActive: boolean;
  createdAt: string;
  __v: number;
}

interface OffersDropdownProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCloseDropdown?: () => void; // Add close callback
  isSticky?: boolean;
}

const OffersDropdown = ({
  onMouseEnter,
  onMouseLeave,
  onCloseDropdown,
  isSticky = false,
}: OffersDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [offers, setOffers] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          "https://gamersbd-server.onrender.com/api/categories",
        );
        const result = await response.json();
        if (result.success) {
          // Filter for specific offer categories by slug
          const offerCategories = result.data.filter(
            (cat: Category) =>
              cat.slug === "today-s-deals" ||
              cat.slug === "flash-sales" ||
              cat.slug === "bundle-offers" ||
              cat.name === "Gift Cards",
          );
          setOffers(offerCategories);
        } else {
          setError("Failed to load offers");
        }
      } catch (err) {
        setError("Error loading offers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Handle link click - close dropdown
  const handleLinkClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onCloseDropdown) {
      onCloseDropdown();
    }
  };

  // Get icon and gradient for each offer type
  const getOfferTheme = (offerName: string) => {
    const name = offerName.toLowerCase();
    if (name.includes("today") || name.includes("deal")) {
      return {
        icon: "⭐",
        gradient: "from-blue-500 to-cyan-500",
        badge: "Daily Deal",
        discount: "Up to 70% OFF",
      };
    }
    if (name.includes("flash")) {
      return {
        icon: "⚡",
        gradient: "from-orange-500 to-red-500",
        badge: "Limited Time",
        discount: "Up to 50% OFF",
      };
    }
    if (name.includes("bundle")) {
      return {
        icon: "🎁",
        gradient: "from-purple-500 to-pink-500",
        badge: "Save More",
        discount: "Buy More, Save More",
      };
    }
    if (name.includes("gift")) {
      return {
        icon: "💝",
        gradient: "from-pink-500 to-rose-500",
        badge: "Perfect Gift",
        discount: "Special Prices",
      };
    }
    return {
      icon: "🏷️",
      gradient: "from-gray-500 to-gray-600",
      badge: "Special Offer",
      discount: "Limited Time",
    };
  };

  if (loading) {
    return (
      <div
        className={`bg-[#1a1a1a] dark:bg-gray-900 max-w-7xl mx-auto  shadow-xl border-t border-gray-800 ${
          isSticky ? "fixed left-0 right-0 mx-auto" : "absolute left-0 right-0"
        }`}
        style={{
          top: isSticky ? "73px" : "100%",
          zIndex: 100,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-orange-500/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-[#1a1a1a] dark:bg-gray-900 max-w-7xl mx-auto  shadow-xl border-t border-gray-800 ${
          isSticky ? "fixed left-0 right-0 mx-auto" : "absolute left-0 right-0"
        }`}
        style={{
          top: isSticky ? "73px" : "100%",
          zIndex: 100,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-500 font-medium">Failed to load offers</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Try again →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className={`bg-[#1a1a1a] dark:bg-gray-900 max-w-7xl mx-auto  shadow-xl border-t border-gray-800 py-8 ${
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
      <div className="px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              LIMITED TIME
            </span>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Special Offers
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Don't miss out on these amazing deals
          </p>
        </div>

        {/* Main Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, index) => {
            const theme = getOfferTheme(offer.name);

            return (
              <Link
                key={offer._id}
                href={`/categories/${offer._id}`}
                onClick={handleLinkClick}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg bg-gradient-to-r ${theme.gradient} text-white shadow-lg`}
                  >
                    <span>{theme.icon}</span>
                    <span>{theme.badge}</span>
                  </span>
                </div>

                {/* Discount Tag */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-xs font-bold text-white">
                      {theme.discount}
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={offer.image || "/images/sale.jfif"}
                    alt={offer.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {offer.name}
                  </h4>

                  {offer.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {offer.description}
                    </p>
                  )}

                  {/* Shop Now Button */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      Limited stock available
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                      Shop Now
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
                    </span>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/50 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </Link>
            );
          })}
        </div>

        {/* View All Offers Link */}
        {offers.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              onClick={handleLinkClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <span className="text-sm font-semibold text-white">
                View All Offers
              </span>
              <svg
                className="w-4 h-4 text-white transition-transform group-hover:translate-x-1"
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
        )}
      </div>
    </div>
  );
};

export default OffersDropdown;