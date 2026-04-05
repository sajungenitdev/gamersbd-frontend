// components/cart/CartHoverPreview.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../../app/contexts/CartContext";
import Link from "next/link";

interface CartHoverPreviewProps {
  onViewCart: () => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export const CartHoverPreview: React.FC<CartHoverPreviewProps> = ({ 
  onViewCart, 
  onClose,
  anchorEl 
}) => {
  const { items, totalItems, subtotal, removeFromCart, isLoading } = useCart();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8, // 8px margin
        right: window.innerWidth - rect.right,
      });
    }
  }, [anchorEl]);

  if (items.length === 0) {
    return createPortal(
      <div 
        style={{
          position: 'fixed',
          top: position.top,
          right: position.right,
          zIndex: 999999,
        }}
        className="w-80 bg-[#1a1a1a] rounded-lg shadow-2xl border border-gray-800 p-4"
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={onClose}
      >
        <div className="text-center py-6">
          <ShoppingCart className="mx-auto h-10 w-10 text-gray-600" />
          <h3 className="mt-2 text-sm font-medium text-gray-400">Your cart is empty</h3>
          <p className="mt-1 text-xs text-gray-500">Add items to get started</p>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: position.top,
        right: position.right,
        zIndex: 999999,
      }}
      className="w-96 bg-[#1a1a1a] rounded-lg shadow-2xl border border-gray-800 overflow-hidden"
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={onClose}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 bg-[#1a1a1a]">
        <h3 className="text-white font-semibold">Shopping Cart</h3>
        <p className="text-xs text-gray-400">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
      </div>

      {/* Cart Items */}
      <div className="max-h-80 overflow-y-auto">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex gap-3 px-4 py-3 hover:bg-[#252525] transition-colors border-b border-gray-800/50">
            {/* Product Image */}
            <div className="w-12 h-12 flex-shrink-0 bg-[#252525] rounded-md overflow-hidden">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-white font-medium truncate">{item.name}</h4>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              <p className="text-sm text-amber-500 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-gray-500 hover:text-red-500 transition-colors"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Show more indicator */}
      {items.length > 3 && (
        <div className="px-4 py-2 text-center border-b border-gray-800 bg-[#1a1a1a]">
          <p className="text-xs text-gray-500">+ {items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 bg-[#1a1a1a]">
        <div className="flex justify-between mb-3">
          <span className="text-sm text-gray-400">Subtotal:</span>
          <span className="text-lg font-semibold text-white">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onViewCart}
            className="flex-1 bg-[#252525] hover:bg-[#2f2f2f] text-white py-2 rounded-md text-sm font-medium transition-colors"
          >
            View Cart
          </button>
          <Link
            href="/checkout"
            onClick={onViewCart}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-all"
          >
            Checkout
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};