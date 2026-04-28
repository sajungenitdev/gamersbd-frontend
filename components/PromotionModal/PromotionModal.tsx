// components/PromotionModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Gift, Star, Zap } from "lucide-react";

interface PromotionModalProps {
  onClose: () => void;
}

export default function PromotionModal({ onClose }: PromotionModalProps) {
  const [copied, setCopied] = useState(false);
  const promoCode = "DARK20";
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur and gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-gray-900/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative max-w-md w-full mx-auto animate-in fade-in zoom-in-95 duration-300">
        {/* Animated glow effect behind modal */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse" />
        
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-visible">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
          >
            <X size={18} />
          </button>

          {/* Overflow Box Image - PNG style product box breaking out of modal */}
          <div className="relative -mt-16 -mx-6 mb-2 flex justify-center overflow-visible">
            <div className="relative group">
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-2xl -z-10" />
              
              {/* 3D Box Image with realistic styling */}
              <div className="relative transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="relative w-44 h-44 mx-auto">
                  {/* Box top face */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-br from-amber-700 to-amber-800 rounded-t-lg shadow-lg origin-bottom" />
                  
                  {/* Box front face */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-40 h-32 bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg shadow-2xl border border-amber-700/50">
                    {/* Box label design */}
                    <div className="absolute inset-2 bg-gradient-to-br from-amber-900/50 to-transparent rounded-md flex flex-col items-center justify-center">
                      <Star className="w-8 h-8 text-yellow-500 mb-1" fill="currentColor" />
                      <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Premium</div>
                      <div className="text-[10px] text-amber-400/80">Limited Edition</div>
                    </div>
                    {/* Tape details */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-amber-600/60 rounded-sm" />
                  </div>
                  
                  {/* Box right face (3D effect) */}
                  <div className="absolute top-6 right-0 w-6 h-32 bg-gradient-to-l from-amber-900 to-amber-800 rounded-r-lg shadow-lg origin-left" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent rounded-lg pointer-events-none" />
                </div>
                
                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-60" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse opacity-70" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 pb-6 pt-2">
            {/* Limited Badge with shine */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-full backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">
                  FLASH SALE • LIMITED STOCK
                </span>
              </span>
            </div>

            {/* Title with gradient */}
            <h2 className="text-3xl font-bold text-center mb-2">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Gamers BD
              </span>
            </h2>
            <p className="text-gray-400 text-center text-sm mb-4">Exclusive unboxing offer</p>

            {/* Discount Display */}
            <div className="text-center mb-5">
              <div className="inline-flex items-baseline gap-2 bg-gray-900/80 px-4 py-2 rounded-full border border-gray-700">
                <span className="text-gray-400 text-sm line-through">$99.99</span>
                <span className="text-3xl font-bold text-white">$79.99</span>
                <span className="bg-red-600/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </div>
            </div>

            {/* Timer - Countdown */}
            <div className="bg-gray-900/60 rounded-xl p-3 mb-5 border border-gray-800">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-2">
                <Gift className="w-3.5 h-3.5" />
                <span>Offer ends in:</span>
              </div>
              <div className="flex justify-center gap-3">
                <div className="text-center">
                  <div className="bg-black/80 rounded-lg px-3 py-1.5 border border-purple-500/30">
                    <span className="text-2xl font-mono font-bold text-purple-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">HOURS</div>
                </div>
                <div className="text-2xl font-bold text-gray-500 self-center">:</div>
                <div className="text-center">
                  <div className="bg-black/80 rounded-lg px-3 py-1.5 border border-purple-500/30">
                    <span className="text-2xl font-mono font-bold text-purple-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">MINS</div>
                </div>
                <div className="text-2xl font-bold text-gray-500 self-center">:</div>
                <div className="text-center">
                  <div className="bg-black/80 rounded-lg px-3 py-1.5 border border-purple-500/30">
                    <span className="text-2xl font-mono font-bold text-purple-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">SECS</div>
                </div>
              </div>
            </div>

            {/* Promo Code with Copy */}
            <div className="mb-5">
              <div className="text-xs text-gray-500 mb-1.5 text-center">Use promo code at checkout</div>
              <div className="flex items-center gap-2 bg-black/60 rounded-xl border border-gray-700 p-1 pr-1.5">
                <div className="flex-1 text-center font-mono text-lg font-bold tracking-wider text-purple-400 py-2">
                  {promoCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-white"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-gray-900/40 rounded-lg p-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-gray-900/40 rounded-lg p-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-gray-900/40 rounded-lg p-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-gray-900/40 rounded-lg p-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span>Warranty</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] hover:bg-right text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <span>Shop Now →</span>
            </button>

            {/* Security Badges */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-gray-500">SSL Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-gray-500">Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}