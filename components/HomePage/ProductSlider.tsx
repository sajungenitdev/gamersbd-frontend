// components/ProductSlider.tsx
"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState, useRef } from "react";

// Sample product data based on your image
const products = [
  {
    id: 1,
    name: "Baseball Cap",
    category: "Contemporary",
    price: 864,
    originalPrice: 950,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
  },
  {
    id: 2,
    name: "Crew Sweatshirt",
    category: "Casual",
    price: 650,
    originalPrice: 780,
    image:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
  },
  {
    id: 3,
    name: "Crochet Cardigan",
    category: "Contemporary",
    price: 520,
    originalPrice: 620,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
  },
  {
    id: 4,
    name: "Band Collar",
    category: "Formal",
    price: 720,
    originalPrice: 850,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
  },
  {
    id: 5,
    name: "Blouse",
    category: "Contemporary",
    price: 550,
    originalPrice: 680,
    image:
      "https://images.unsplash.com/photo-162420611 2918-f140f087f9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
  },
  {
    id: 6,
    name: "Surplice Top",
    category: "Contemporary",
    price: 500,
    originalPrice: 600,
    image:
      "https://images.unsplash.com/photo-1614251056216-f1d4b13507f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
  },
];

const ProductSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  };

  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  };

  const [itemsToShow, setItemsToShow] = useState(4);

  React.useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getItemsPerView());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      prevSlide();
    }
  };

  return (
    <section className="py-12 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="container mx-auto ">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-black">
              MEGA Sale Spotlight
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Shop our hottest picks at incredible prices
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentIndex === 0
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentIndex >= maxIndex
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div
          ref={sliderRef}
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out gap-6 py-5"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] group"
                style={{
                  flexBasis: `calc(${100 / itemsToShow}% - ${itemsToShow > 1 ? 24 : 0}px)`,
                }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Product Image with Background Color */}
                  <div
                    className={`${product.bgColor} aspect-square p-8 relative overflow-hidden`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100,
                      )}
                      %
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 bg-[#2A2A2A] dark:bg-white">
                    <p className="text-sm text-white dark:text-black mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-semibold text-white dark:text-black mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white dark:text-black">
                        ${product.price}
                      </span>
                      <span className="text-sm text-white dark:text-black line-through">
                        ${product.originalPrice}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full mt-4 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-800 dark:hover:bg-gray-100">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 flex justify-center">
          <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + itemsToShow) / products.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
