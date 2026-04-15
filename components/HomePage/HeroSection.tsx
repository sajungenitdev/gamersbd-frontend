// components/HeroSection.tsx
"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

// Sample slider images (same as before)
const sliderImages = [
  {
    id: 1,
    url: "/images/slider/slider1.jpg",
    alt: "Gaming Console",
  },
  {
    id: 2,
    url: "/images/slider/slider2.jpg",
    alt: "Gaming Accessories",
  },
  {
    id: 3,
    url: "/images/slider/slider3.jpg",
    alt: "VR Gaming",
  },
  {
    id: 4,
    url: "/images/slider/slider5.avif",
    alt: "VR Gaming",
  },
];

// Offers now correspond to slider images (1:1 mapping)
const offers = [
  {
    id: 1,
    image: "/images/slider/si1.jpg",
    imageBg: "bg-purple-100 dark:bg-purple-900/30",
    title: "Monthly Deals",
    description: "DualSense Controller",
    linkText: "Shop Now",
    linkUrl: "/shop", // Changed to Next.js route
  },
  {
    id: 2,
    image: "/images/slider/si2.jpg",
    imageBg: "bg-blue-100 dark:bg-blue-900/30",
    title: "Combo Offers",
    description: "7.1 Surround Sound",
    linkText: "View Deals",
    linkUrl: "/deals",
  },
  {
    id: 3,
    image: "/images/slider/si3.jpg",
    imageBg: "bg-green-100 dark:bg-green-900/30",
    title: "Free Offers",
    description: "RGB Gaming",
    linkText: "Learn More",
    linkUrl: "/offers",
  },
  {
    id: 4,
    image: "/images/slider/si4.jpg",
    imageBg: "bg-orange-100 dark:bg-orange-900/30",
    title: "Pre Orders",
    description: "16000 DPI Sensor",
    linkText: "Check Price",
    linkUrl: "/pre-orders",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all intervals
  const clearAllIntervals = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  // Start the progress bar animation for current thumbnail
  const startProgress = () => {
    setProgress(0);
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      // When progress reaches 100%, move to next slide
      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current!);
        goToNextSlide();
      }
    }, 16); // Update every ~60fps
  };

  // Go to next slide
  const goToNextSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % sliderImages.length;
      return next;
    });
  };

  // Go to specific slide
  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setCurrentSlide(index);
    resetProgress();
  };

  // Reset progress for current thumbnail
  const resetProgress = () => {
    clearAllIntervals();
    startProgress();
  };

  // Setup auto-slide with progress
  useEffect(() => {
    startProgress();

    return () => {
      clearAllIntervals();
    };
  }, []);

  // Reset progress when slide changes manually
  useEffect(() => {
    resetProgress();
  }, [currentSlide]);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any link navigation
    e.stopPropagation(); // Stop event bubbling
    goToNextSlide();
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any link navigation
    e.stopPropagation(); // Stop event bubbling
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  // Handle main slider click navigation
  const handleSliderClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.preventDefault();
      return;
    }
    // Navigate to shop
    window.location.href = '/shop';
  };

  return (
    <div className="bg-[#191919] dark:bg-white">
      <div className="max-w-7xl mx-auto py-8 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Side - Main Slider */}
          <div className="lg:col-span-4 relative group">
            <div 
              onClick={handleSliderClick}
              className="relative h-[568px] rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-800/50 cursor-pointer"
            >
              {/* Images */}
              {sliderImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                    index === currentSlide
                      ? "translate-x-0"
                      : "translate-x-full"
                  }`}
                  style={{
                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay - darker in dark mode */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/50" />
                </div>
              ))}
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Side - Thumbnail Progress Indicators */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-4">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                onClick={() => goToSlide(index)}
                className={`relative bg-[#28282c] dark:bg-white rounded-xl overflow-hidden transition-all duration-300 group cursor-pointer ${
                  index === currentSlide
                    ? "ring-2 ring-orange-500 dark:ring-orange-500 scale-[1.02]"
                    : "hover:scale-[1.01] hover:shadow-lg"
                }`}
              >
                {/* Progress bar at the bottom of active thumbnail */}
                {index === currentSlide && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600/30 dark:bg-gray-200/30 z-10">
                    <div
                      className="h-full bg-orange-500 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center p-0">
                  {/* Left side - Image/Icon */}
                  <div
                    className={`flex-shrink-0 w-24 h-[130px] ${offer.imageBg} rounded-[8px] flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden ${
                      index === currentSlide ? "scale-105" : ""
                    }`}
                  >
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full rounded-[8px] object-cover"
                    />
                  </div>

                  {/* Right side - Text and Link */}
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-xs font-semibold text-white dark:text-gray-600 uppercase tracking-wider font-lato">
                      {offer.title}
                    </h3>
                    <p className="text-sm font-light text-white dark:text-gray-400 mt-1 truncate">
                      {offer.description}
                    </p>
                    {/* Optional: Add CTA button */}
                    <Link 
                      href={offer.linkUrl}
                      className="inline-block mt-2 text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()} // Prevent thumbnail click when clicking link
                    >
                      {offer.linkText} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add custom animation for fade-in */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default HeroSection;