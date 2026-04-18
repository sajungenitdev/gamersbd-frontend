// components/PromotionModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PromotionModalProps {
  onClose: () => void;
}

export default function PromotionModal({ onClose }: PromotionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        {/* Promotion Content */}
        <div className="p-6">
          {/* Decorative Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
              LIMITED TIME OFFER
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            🎉 Special Promotion!
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get <span className="font-bold text-purple-600 dark:text-purple-400">20% OFF</span> on your first order! 
            Use code: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">WELCOME20</span>
          </p>
          
          {/* Additional Details */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>✓</span>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>✓</span>
              <span>24/7 customer support</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>✓</span>
              <span>30-day money-back guarantee</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Shop Now →
          </button>
          
          {/* Dismiss Option */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
            This promotion will expire in 48 hours
          </p>
        </div>
      </div>
    </div>
  );
}