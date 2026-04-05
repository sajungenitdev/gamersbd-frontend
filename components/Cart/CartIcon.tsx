// components/cart/CartIcon.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../app/contexts/CartContext";

interface CartIconProps {
  onClick: () => void;
  className?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({ onClick, className = "" }) => {
  const { totalItems, isLoading } = useCart();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(totalItems);
  }, [totalItems]);

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-full hover:bg-gray-800 transition-colors ${className}`}
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {isLoading ? "..." : (count > 99 ? "99+" : count)}
        </span>
      )}
    </button>
  );
};