// components/HeroSection.tsx
"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

// Sample slider images
const sliderImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80",
    alt: "Gaming Console",
    title: "PlayStation 5",
    subtitle: "Experience the next generation",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    alt: "Gaming Accessories",
    title: "Premium Accessories",
    subtitle: "Level up your gaming experience",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1592155931584-901ac15763e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
    alt: "VR Gaming",
    title: "Virtual Reality",
    subtitle: "Immerse yourself in new worlds",
  },
];

// Sample offers data based on your image
const offers = [
  {
    id: 1,
    title: "OFFER SPECIAL",
    subtitle: "Monthly Deals",
    price: "$2.99",
    bgColor: "bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "SUPER COMBO",
    subtitle: "COMBO Offer",
    badge: "NEW",
    bgColor: "bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "FREE GAMES",
    subtitle: "NOW!",
    badge: "PREORDER",
    bgColor: "bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-500 dark:to-red-500",
    textColor: "text-white",
  },
  {
    id: 4,
    title: "Promo Code",
    subtitle: "SAVE 20%",
    code: "GAMER2024",
    bgColor: "bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-500 dark:to-emerald-500",
    textColor: "text-white",
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

    <div className="container mx-auto  py-8  transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Slider (2/3 width) */}
        <div className="lg:col-span-2 relative group">
          {/* Slider Container */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-800/50">
            {/* Images */}
            {sliderImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentSlide ? "translate-x-0" : "translate-x-full"
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

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-2 animate-fade-in drop-shadow-lg">
                    {image.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 mb-4 drop-shadow-md">
                    {image.subtitle}
                  </p>
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-blue-500/20">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}

            {/* Navigation Arrows - dark mode friendly */}
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

            {/* Dots Indicator - dark mode friendly */}
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

        {/* Right Side - Offers Grid (1/3 width) */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          {/* Offer 1 - Special Deal */}
          <div
            className={`${offers[0].bgColor} ${offers[0].textColor} rounded-2xl p-6 shadow-lg dark:shadow-gray-800/50 transform hover:scale-105 transition-all duration-300 col-span-2`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold tracking-wider text-white/90">
                  {offers[0].title}
                </p>
                <h3 className="text-3xl font-bold mt-2 text-white">
                  {offers[0].subtitle}
                </h3>
                <p className="text-4xl font-black mt-4 text-white">
                  {offers[0].price}
                </p>
              </div>
              <span className="px-3 py-1 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                DEALS
              </span>
            </div>
          </div>

          {/* Offer 2 - Super Combo */}
          <div
            className={`${offers[1].bgColor} ${offers[1].textColor} rounded-2xl p-6 shadow-lg dark:shadow-gray-800/50 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="relative">
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white text-xs font-bold rounded-full shadow-lg">
                {offers[1].badge}
              </span>
              <p className="text-sm font-semibold tracking-wider text-white/90">
                {offers[1].title}
              </p>
              <h3 className="text-xl font-bold mt-2 text-white">
                {offers[1].subtitle}
              </h3>
              <div className="mt-4 text-2xl font-black text-white">🔥</div>
            </div>
          </div>

          {/* Offer 3 - Free Games */}
          <div
            className={`${offers[2].bgColor} ${offers[2].textColor} rounded-2xl p-6 shadow-lg dark:shadow-gray-800/50 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="relative">
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-purple-400 dark:bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                {offers[2].badge}
              </span>
              <p className="text-sm font-semibold tracking-wider text-white/90">
                {offers[2].title}
              </p>
              <h3 className="text-2xl font-bold mt-2 text-white">
                {offers[2].subtitle}
              </h3>
              <div className="mt-4 flex -space-x-2">
                <div className="w-8 h-8 bg-white/30 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-sm text-white">
                  🎮
                </div>
                <div className="w-8 h-8 bg-white/30 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-sm text-white">
                  🎲
                </div>
                <div className="w-8 h-8 bg-white/30 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-sm text-white">
                  🎯
                </div>
              </div>
            </div>
          </div>

          {/* Offer 4 - Promo Code */}
          <div
            className={`${offers[3].bgColor} ${offers[3].textColor} rounded-2xl p-6 shadow-lg dark:shadow-gray-800/50 transform hover:scale-105 transition-all duration-300 col-span-2`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold tracking-wider text-white/90">
                  {offers[3].title}
                </p>
                <h3 className="text-2xl font-bold mt-1 text-white">
                  {offers[3].subtitle}
                </h3>
              </div>
              <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 dark:border-white/10">
                <code className="text-lg font-mono font-bold text-white">
                  {offers[3].code}
                </code>
              </div>
            </div>
          </div>
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