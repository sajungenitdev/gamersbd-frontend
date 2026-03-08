import { User, Heart, ShoppingCart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

const TopBar = () => {
  return (
    <div className="bg-[#2a2a2a] dark:bg-gray-100 text-gray-100 dark:text-gray-900 border-b border-gray-800 dark:border-gray-200">
      <div className="max-w-7xl mx-auto py-2 px-0 flex flex-wrap items-center justify-between font-sans text-[13px] tracking-wide">
        {/* Left Side: Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap font-lato">
          <Link
            href="/shop"
            className="hover:text-[#e87831] dark:hover:text-[#e87831] transition-colors uppercase font-medium"
          >
            Store
          </Link>
          <Link
            href="/track-order"
            className="hover:text-[#e87831] dark:hover:text-[#e87831] transition-colors uppercase font-medium"
          >
            Track Order
          </Link>
          <Link
            href="/about"
            className="hover:text-[#e87831] dark:hover:text-[#e87831] transition-colors uppercase font-medium"
          >
            About GB
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#e87831] dark:hover:text-[#e87831] transition-colors uppercase font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Right Side: User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          {/* Sign In / Account */}
          <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-3 border-r border-gray-700 dark:border-gray-300">
            <User size={16} className="text-gray-400 dark:text-gray-500" />
            <Link
              href="/auth"
              className="hover:text-[#e87831] dark:hover:text-[#e87831] whitespace-nowrap"
            >
              Sign in
            </Link>
          </div>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="flex items-center gap-1 pr-2 sm:pr-3 border-r border-gray-700 dark:border-gray-300 relative group"
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className="text-gray-400 dark:text-gray-500 group-hover:text-[#e87831] dark:group-hover:text-[#e87831] transition-colors"
            />
            <span className="bg-red-600 dark:bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-1 pr-2 sm:pr-3 border-r border-gray-700 dark:border-gray-300 relative group"
          >
            <ShoppingCart
              size={18}
              strokeWidth={1.5}
              className="text-gray-400 dark:text-gray-500 group-hover:text-[#e87831] dark:group-hover:text-[#e87831] transition-colors"
            />
            <span className="bg-red-600 dark:bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Theme Toggle */}
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
