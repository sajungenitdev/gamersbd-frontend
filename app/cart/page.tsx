"use client";

import React from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const CartPage = () => {
  const { items, subtotal, updateQuantity, removeFromCart, isLoading } = useCart();

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center">
          <ShoppingBag size={48} className="text-gray-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link 
          href="/shop" 
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md font-medium transition-all"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart ({items.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#1a1a1a] rounded-xl border border-gray-800 group hover:border-gray-700 transition-all"
            >
              {/* Product Image */}
              <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              
              {/* Product Details */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                <p className="text-amber-500 font-bold text-lg">${item.price.toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 bg-[#2a2a2a] rounded-lg p-1.5 border border-gray-700">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                title="Remove item"
              >
                <Trash2 size={22} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8 border-b border-gray-800 pb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-white mb-8">
              <span>Total</span>
              <span className="text-amber-500">${subtotal.toFixed(2)}</span>
            </div>

            <Link 
              href="/checkout"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-amber-900/20 transform hover:-translate-y-1 transition-all active:translate-y-0"
            >
              Secure Checkout <ArrowRight size={20} />
            </Link>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              Prices include all applicable taxes and fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;