"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

interface OfferItem {
  name: string;
  href: string;
  badge: string;
  description?: string;
  discount?: string;
  endDate?: string;
}

interface OffersDropdownProps {
  items: OfferItem[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isSticky?: boolean;
}

const OffersDropdown = ({
  items,
  onMouseEnter,
  onMouseLeave,
  isSticky = false,
}: OffersDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={dropdownRef}
      className={`bg-[#2a2a2a] dark:bg-gray-900 shadow-xl border-t border-[#2a2a2a] dark:border-gray-800 py-8 max-w-7xl mx-auto px-4 transition-all duration-300 ${
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
      <div className="max-w-7xl mx-auto">
        {/* Main Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group relative  transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Content */}
              <div className="flex flex-col h-full">
                <h4 className="text-lg font-bold text-white dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {item.name}
                </h4>

                <div>
                  <img
                    className="h-48 w-full object-cover rounded-2xl"
                    src="https://gamersbd.com/wp-content/uploads/2022/05/monthly-deals-design-templa.jpg"
                    alt=""
                  />
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400"
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersDropdown;
