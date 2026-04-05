// components/HeroSection.tsx
"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

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
  {
    id: 5,
    url: "/images/slider/slider6.webp",
    alt: "VR Gaming",
  },
];

// Redesigned offers with image + text + link pattern
const offers = [
  {
    id: 1,
    image: "/images/slider/si1.jpg",
    imageBg: "bg-purple-100 dark:bg-purple-900/30",
    title: "Monthly Deals",
    description: "DualSense Controller",
    linkText: "Shop Now",
    linkUrl: "#",
    bgColor: "bg-[#2a2a2a] dark:bg-white",
    textColor: "text-gray-900 dark:text-white",
  },
  {
    id: 2,
    image:
      "/images/slider/si2.jpg",
    imageBg: "bg-blue-100 dark:bg-blue-900/30",
    title: "Combo Offers",
    description: "7.1 Surround Sound",
    linkText: "View Deals",
    linkUrl: "#",
    bgColor: "bg-[#2a2a2a] dark:bg-white",
    textColor: "text-gray-900 dark:text-white",
  },
  {
    id: 3,
    image:
      "/images/slider/si3.jpg",
    imageBg: "bg-green-100 dark:bg-green-900/30",
    title: "Free Offers",
    description: "RGB Gaming",
    linkText: "Learn More",
    linkUrl: "#",
    bgColor: "bg-[#2a2a2a] dark:bg-white",
    textColor: "text-gray-900 dark:text-white",
  },
  {
    id: 4,
    image: "/images/slider/si4.jpg",
    imageBg: "bg-orange-100 dark:bg-orange-900/30",
    title: "Pre Orders",
    description: "16000 DPI Sensor",
    linkText: "Check Price",
    linkUrl: "#",
    bgColor: "bg-[#2a2a2a] dark:bg-white",
    textColor: "text-gray-900 dark:text-white",
  },
  {
    id: 5,
    image: "/images/slider/si5.jpg",
    imageBg: "bg-orange-100 dark:bg-orange-900/30",
    title: "Pre Orders",
    description: "16000 DPI Sensor",
    linkText: "Check Price",
    linkUrl: "#",
    bgColor: "bg-[#2a2a2a] dark:bg-white",
    textColor: "text-gray-900 dark:text-white",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  return (
    <div className="bg-[#1a1a1a] dark:bg-white">
      <div className="max-w-7xl mx-auto py-8 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Side - Slider (3/4 width) */}
          <div className="lg:col-span-4 relative group">
            <div className="relative h-[550px] rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-800/50">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all ${
                      index === currentSlide
                        ? "w-8 bg-white dark:bg-blue-400"
                        : "w-2 bg-white/50 dark:bg-gray-400/50 hover:bg-white/80 dark:hover:bg-gray-300/80"
                    } h-2 rounded-full`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Offers Grid with Image + Text + Link pattern */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`${offer.bgColor} ${offer.textColor} rounded-xl shadow-lg dark:shadow-gray-800/50 overflow-hidden hover:shadow-xl transition-all duration-300 group`}
              >
                {/* <div className="flex items-center p-4 bg-[#2a2a2a] dark:bg-gray-900/30"> */}
                <div className="flex items-center p-0 ">
                  {/* Left side - Image/Icon */}
                  <div
                    className={`flex-shrink-0 w-20 h-24 ${offer.imageBg} rounded-xl flex items-center justify-center text-4xl mr-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>

                  {/* Right side - Text and Link */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold truncate text-white font-lato">
                      {offer.title}
                    </h3>
                    {/* <p className="text-sm text-gray-400 dark:text-gray-400 mb-2 truncate">
                      {offer.description}
                    </p> */}
                    {/* <a
                      href={offer.linkUrl}
                      className="inline-flex items-center text-sm font-semibold text-[#d88616] dark:text-blue-400 hover:text-[#d88616] dark:hover:text-blue-300 transition-colors"
                    >
                      {offer.linkText}
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a> */}
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
