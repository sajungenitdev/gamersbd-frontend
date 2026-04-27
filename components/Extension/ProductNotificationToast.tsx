"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Package, Clock, ChevronRight, TrendingUp, Eye, Sparkles } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
}

interface ProductNotificationToastProps {
  products?: Product[];
  displayDuration?: number; // Time per card
  cardsPerCycle?: number;
  position?: "left" | "right";
}

export function ProductNotificationToast({
  products: externalProducts,
  displayDuration = 2000,
  cardsPerCycle = 4,
  position = "right",
}: ProductNotificationToastProps) {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

 const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const isHoveringRef = useRef<boolean>(false);
  const hasFinishedRef = useRef<boolean>(false);
  const isClosingRef = useRef<boolean>(false); // Track if we're closing current card

  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Gaming Mouse Pro",
      price: 49.99,
      image: "https://picsum.photos/id/1/100/100",
      category: "Gaming",
      discount: 20,
    },
    {
      id: "2",
      name: "Mechanical Keyboard",
      price: 89.99,
      image: "https://picsum.photos/id/2/100/100",
      category: "Accessories",
      discount: 15,
    },
    {
      id: "3",
      name: "4K Gaming Monitor",
      price: 299.99,
      image: "https://picsum.photos/id/3/100/100",
      category: "Displays",
      discount: 10,
    },
    {
      id: "4",
      name: "Wireless Headset",
      price: 79.99,
      image: "https://picsum.photos/id/4/100/100",
      category: "Audio",
      discount: 25,
    },
  ];

  const products = externalProducts || mockProducts;
  const cycleProducts = products.slice(0, cardsPerCycle);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, []);

  const moveToNextCard = useCallback(() => {
    if (currentIndexRef.current < cycleProducts.length - 1) {
      // Move to next card
      setIsExiting(true);
      setTimeout(() => {
        currentIndexRef.current += 1;
        setCurrentCardIndex(currentIndexRef.current);
        setCurrentProduct(cycleProducts[currentIndexRef.current]);
        setProgress(0);
        startTimeRef.current = Date.now();
        setIsExiting(false);
        isClosingRef.current = false;
        animationRef.current = requestAnimationFrame(update);
      }, 250);
    } else {
      // End of all cards - finish completely
      isRunningRef.current = false;
      hasFinishedRef.current = true;
      stopAnimation();
      setIsVisible(false);
      setIsExiting(false);
    }
  }, [cycleProducts, stopAnimation]);

  const handleCloseCard = useCallback(() => {
    if (isClosingRef.current) return; // Prevent multiple closes
    isClosingRef.current = true;
    stopAnimation();
    moveToNextCard();
  }, [stopAnimation, moveToNextCard]);

  const handleFinish = useCallback(() => {
    // Complete finish the entire sequence
    isRunningRef.current = false;
    hasFinishedRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      stopAnimation();
      setIsVisible(false);
      setIsExiting(false);
    }, 300);
  }, [stopAnimation]);

  const update = useCallback(() => {
    if (!isRunningRef.current || isHoveringRef.current || isClosingRef.current) return;

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const currentProgress = Math.min((elapsed / displayDuration) * 100, 100);

    setProgress(currentProgress);

    if (currentProgress >= 100) {
      moveToNextCard();
    } else {
      animationRef.current = requestAnimationFrame(update);
    }
  }, [displayDuration, moveToNextCard]);

  const startSequence = useCallback(() => {
    if (isRunningRef.current || hasFinishedRef.current) return;

    isRunningRef.current = true;
    isClosingRef.current = false;
    currentIndexRef.current = 0;
    setCurrentCardIndex(0);
    setCurrentProduct(cycleProducts[0]);
    setIsVisible(true);
    setIsExiting(false);
    setProgress(0);
    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(update);
  }, [cycleProducts, update]);

  // Run once on Mount
  useEffect(() => {
    const timer = setTimeout(startSequence, 3000);
    return () => {
      clearTimeout(timer);
      stopAnimation();
    };
  }, [startSequence, stopAnimation]);

  // Pause on Hover
  useEffect(() => {
    isHoveringRef.current = isHovering;
    if (isHovering && !isClosingRef.current) {
      stopAnimation();
    } else if (isRunningRef.current && isVisible && !isExiting && !isClosingRef.current && !isHovering) {
      startTimeRef.current = Date.now() - (progress / 100) * displayDuration;
      animationRef.current = requestAnimationFrame(update);
    }
  }, [isHovering, isVisible, displayDuration, progress, stopAnimation, update, isExiting]);

  if (!isVisible || !currentProduct) return null;

  const discountPercentage = currentProduct.discount;
  const originalPrice = currentProduct.price;
  const discountedPrice = discountPercentage 
    ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <>
      <style jsx global>{`
        @keyframes slide-in-right-modern {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes slide-in-left-modern {
          0% {
            opacity: 0;
            transform: translateX(-100%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes slide-out-right-modern {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
        }
        
        @keyframes slide-out-left-modern {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-100%) scale(0.9);
          }
        }
        
        @keyframes shimmer-card {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right-modern 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left-modern 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }
        
        .animate-slide-out-right {
          animation: slide-out-right-modern 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-slide-out-left {
          animation: slide-out-left-modern 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .card-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(249, 115, 22, 0.05),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer-card 3s infinite;
        }
      `}</style>

      <div
        className={`fixed z-[9999] ${
          position === "left" ? "bottom-6 left-6" : "bottom-6 right-6"
        }`}
      >
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`
            relative w-[360px] md:w-[400px]
            ${isExiting 
              ? (position === "left" ? "animate-slide-out-left" : "animate-slide-out-right")
              : (position === "left" ? "animate-slide-in-left" : "animate-slide-in-right")
            }
          `}
        >
          {/* Main Card */}
          <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-2xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-sm">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent card-shimmer pointer-events-none" />
            
            {/* Progress Bar with Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-[16ms] linear relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full blur-sm" />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseCard}
              className="absolute top-4 right-4 text-gray-600 hover:text-white transition-all duration-300 z-10 hover:scale-110"
            >
              <X size={16} />
            </button>

            {/* Content */}
            <div className="p-5 pt-6">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-[1px]">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-900">
                      <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Discount Badge */}
                  {discountPercentage && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg">
                      -{discountPercentage}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={10} className="text-orange-500" />
                      <span className="text-[9px] font-black text-orange-500 uppercase tracking-wider">
                        {currentProduct.category}
                      </span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                    <div className="flex items-center gap-1">
                      <Eye size={9} className="text-gray-600" />
                      <span className="text-[9px] text-gray-600 font-medium">Trending</span>
                    </div>
                  </div>
                  
                  <h4 className="text-white font-bold text-sm truncate mb-1.5">
                    {currentProduct.name}
                  </h4>
                  
                  <div className="flex items-baseline gap-2">
                    {discountedPrice ? (
                      <>
                        <span className="text-xl font-black text-white">
                          ${discountedPrice}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          ${originalPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-black text-white">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock indicator */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-gray-500 font-medium">In Stock</span>
                    <Sparkles size={10} className="text-orange-500 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-4 pt-3 flex justify-between items-center border-t border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-orange-500" />
                <span className="text-[10px] text-gray-500 font-mono font-bold tracking-wider">
                  {String(currentCardIndex + 1).padStart(2, '0')}/{String(cycleProducts.length).padStart(2, '0')}
                </span>
              </div>
              
              <button className="group relative text-[10px] font-black text-orange-500 uppercase flex items-center gap-1.5 transition-all duration-300 hover:gap-2.5">
                <span>View Deal</span>
                <ChevronRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                <div className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </button>
            </div>

            {/* Hover Overlay */}
            {isHovering && (
            //   <div className="absolute inset-0 bg-black/900 backdrop-blur-[0.5px] flex items-center justify-center transition-all duration-300">
            //     <span className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 rounded-full text-[10px] text-white shadow-lg font-black uppercase tracking-wider">
            //       Paused
            //     </span>
            //   </div>
            <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}