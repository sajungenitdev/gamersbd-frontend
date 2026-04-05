// components/TopBar.tsx (Enhanced version with drawer hover persistence)
"use client";
import { User, Heart, ShoppingCart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useUserAuth } from "../../app/contexts/UserAuthContext";
import { useCart } from "../../app/contexts/CartContext";
import { CartDrawer } from "../Cart/CartDrawer";

const TopBar = () => {
  const { user } = useUserAuth();
  const { totalItems, isLoading } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isHoveringCart, setIsHoveringCart] = useState(false);
  const [isHoveringDrawer, setIsHoveringDrawer] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout>();

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    setCartCount(totalItems);
  }, [totalItems]);

  // Handle drawer visibility based on hover state
  useEffect(() => {
    // Clear any pending close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    // Open drawer if hovering cart or drawer
    if (isHoveringCart || isHoveringDrawer) {
      setIsCartDrawerOpen(true);
    } else {
      // Delay closing to prevent accidental closes
      closeTimerRef.current = setTimeout(() => {
        setIsCartDrawerOpen(false);
      }, 200);
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [isHoveringCart, isHoveringDrawer]);

  const handleCartClick = () => {
    // Optional: toggle on click as well
    setIsCartDrawerOpen(!isCartDrawerOpen);
  };

  return (
    <>
      <div className="bg-[#2a2a2a] dark:bg-gray-100 text-gray-100 dark:text-gray-900 border-b border-gray-800 dark:border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between font-sans text-[13px] tracking-wide">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap font-lato">
            <Link href="/shop" className="hover:text-[#e87831] transition-colors uppercase font-medium">
              Store
            </Link>
            <Link href="/track-order" className="hover:text-[#e87831] transition-colors uppercase font-medium">
              Track Order
            </Link>
            <Link href="/about" className="hover:text-[#e87831] transition-colors uppercase font-medium">
              About GB
            </Link>
            <Link href="/contact" className="hover:text-[#e87831] transition-colors uppercase font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
            {!user ? (
              <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-3 border-r border-gray-700">
                <User size={16} className="text-gray-400" />
                <Link href="/auth" className="hover:text-[#e87831] whitespace-nowrap">
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-gray-700">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-semibold">{getUserInitials()}</span>
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm hover:text-[#e87831] transition-colors">
                    {user.name}
                  </span>
                </Link>
              </div>
            )}

            <Link href="/wishlist" className="flex items-center gap-1 pr-2 sm:pr-3 border-r border-gray-700 relative group">
              <Heart size={18} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#e87831] transition-colors" />
              <span className="bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center absolute -top-1 -right-1">
                {wishlistCount}
              </span>
            </Link>

            {/* Cart Button */}
            <div 
              onMouseEnter={() => setIsHoveringCart(true)}
              onMouseLeave={() => setIsHoveringCart(false)}
            >
              <button 
                onClick={handleCartClick}
                className="flex items-center gap-1 pr-2 sm:pr-3 border-r border-gray-700 relative group"
              >
                <ShoppingCart size={18} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#e87831] transition-colors" />
                <span className="bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center absolute -top-1 -right-1">
                  {isLoading ? "..." : cartCount}
                </span>
              </button>
            </div>

            <div className="ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer - Opens on Hover, stays open while hovering drawer */}
      <div
        onMouseEnter={() => setIsHoveringDrawer(true)}
        onMouseLeave={() => setIsHoveringDrawer(false)}
      >
        <CartDrawer 
          isOpen={isCartDrawerOpen} 
          onClose={() => setIsCartDrawerOpen(false)} 
        />
      </div>
    </>
  );
};

export default TopBar;