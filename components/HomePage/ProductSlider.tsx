// components/ProductSlider.tsx
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

// Sample product data based on your image
const products = [
  {
    id: 1,
    name: "Baseball Cap",
    category: "Contemporary",
    price: 864,
    originalPrice: 950,
    image:
      "https://gamersbd.com/wp-content/uploads/2022/06/b4dc4-24-2-300x375.jpg",
  },
  {
    id: 2,
    name: "Crew Sweatshirt",
    category: "Casual",
    price: 650,
    originalPrice: 780,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/01/egs-cyberpunk2077-cdprojektred-g1a-13-02-24-22-1920x1080-dd4dcc601c17-300x375.jpg",
  },
  {
    id: 3,
    name: "Crochet Cardigan",
    category: "Contemporary",
    price: 520,
    originalPrice: 620,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/03/egs-cyberpunk2077-cdprojektred-g1a-03-1920x1080-c25ac94167df-300x375.jpg",
  },
  {
    id: 4,
    name: "Band Collar",
    category: "Formal",
    price: 720,
    originalPrice: 850,
    image:
      "https://gamersbd.com/wp-content/uploads/2015/12/egs-finalfantasyviiremakeintergrade-squareenix-g1a-01-1920x1080-05bc7f9ce725-300x375.jpg",
  },
  {
    id: 5,
    name: "Denim Jacket",
    category: "Casual",
    price: 1200,
    originalPrice: 1500,
    image:
      "https://gamersbd.com/wp-content/uploads/2022/06/b4dc4-24-2-300x375.jpg",
  },
  {
    id: 6,
    name: "Graphic Tee",
    category: "Streetwear",
    price: 450,
    originalPrice: 550,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/01/egs-cyberpunk2077-cdprojektred-g1a-13-02-24-22-1920x1080-dd4dcc601c17-300x375.jpg",
  },
];

const ProductSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [loadingTimeout, setLoadingTimeout] = useState<{ [key: number]: boolean }>(
    {},
  );
  const sliderRef = useRef<HTMLDivElement>(null);

  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  };

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getItemsPerView());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsToShow);

  // Reset currentIndex if it exceeds maxIndex
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  // Set timeout for each image to prevent infinite loading
  useEffect(() => {
    products.forEach((product) => {
      const timer = setTimeout(() => {
        if (!imagesLoaded[product.id] && !imageErrors[product.id]) {
          setLoadingTimeout((prev) => ({ ...prev, [product.id]: true }));
          setImagesLoaded((prev) => ({ ...prev, [product.id]: true })); // Force mark as loaded
        }
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    });
  }, [imagesLoaded, imageErrors]);

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

  const handleImageLoad = (productId: number) => {
    setImagesLoaded((prev) => ({ ...prev, [productId]: true }));
    console.log(`Image ${productId} loaded successfully`);
  };

  const handleImageError = (productId: number) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
    setImagesLoaded((prev) => ({ ...prev, [productId]: true })); // Mark as loaded to hide spinner
    console.log(`Image ${productId} failed to load`);
  };

  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Preload images on component mount
  useEffect(() => {
    products.forEach((product) => {
      const img = new Image();
      img.src = product.image;
      img.onload = () => handleImageLoad(product.id);
      img.onerror = () => handleImageError(product.id);
    });
  }, []);

  return (
    <section className="py-12 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl text-white dark:text-black">
              MEGA Sale Spotlight
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentIndex === 0
                  ? "bg-gray-800 dark:bg-gray-200 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-400"
              }`}
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentIndex >= maxIndex
                  ? "bg-gray-800 dark:bg-gray-200 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-400"
              }`}
              aria-label="Next slide"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
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
                className="flex-shrink-0 w-full"
                style={{
                  flexBasis: `calc(${100 / itemsToShow}% - ${
                    itemsToShow > 1 ? (24 * (itemsToShow - 1)) / itemsToShow : 0
                  }px)`,
                }}
              >
                <div className="relative group overflow-hidden rounded-2xl transition-all duration-300">
                  {/* Product Image with Loading State */}
                  <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-800 dark:bg-gray-200">
                    {/* Loading Spinner - Show only if not loaded and no error and no timeout */}
                    {!imagesLoaded[product.id] && !imageErrors[product.id] && !loadingTimeout[product.id] && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    {/* Error Fallback */}
                    {imageErrors[product.id] && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                        <div className="text-center">
                          <div className="text-gray-400 text-xs">
                            Failed to load
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timeout Fallback */}
                    {loadingTimeout[product.id] && !imagesLoaded[product.id] && !imageErrors[product.id] && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                        <div className="text-center">
                          <div className="text-gray-400 text-xs">
                            Taking too long
                          </div>
                        </div>
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${
                        imagesLoaded[product.id] && !imageErrors[product.id]
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(product.id)}
                      onError={() => handleImageError(product.id)}
                      loading="lazy"
                    />

                    {/* Discount Badge - Show always once image is considered "loaded" (either success, error, or timeout) */}
                    {(imagesLoaded[product.id] || loadingTimeout[product.id]) &&
                      !imageErrors[product.id] &&
                      product.originalPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                          -
                          {calculateDiscount(
                            product.price,
                            product.originalPrice,
                          )}
                          %
                        </div>
                      )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-sm text-gray-400 dark:text-gray-600 mb-1">
                      {product.category}
                    </p>

                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-normal text-white dark:text-black">
                        {product.name}
                      </h3>
                      <button
                        className="p-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCartIcon className="w-4 h-4 text-white dark:text-black" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white dark:text-black font-semibold text-lg">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="text-sm text-gray-400 dark:text-gray-600 line-through">
                            ${product.originalPrice}
                          </span>
                          <span className="text-xs text-[#d88616] dark:text-green-600 font-medium">
                            Save ${product.originalPrice - product.price}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar and Pagination */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Progress Bar */}
          <div className="w-48 h-1 bg-gray-800 dark:bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d88616] dark:bg-green-600 rounded-full transition-all duration-300"
              style={{
                width:
                  maxIndex > 0 ? `${(currentIndex / maxIndex) * 100}%` : "0%",
              }}
            />
          </div>

          {/* Pagination Dots for Mobile */}
          <div className="flex justify-center gap-2 md:hidden">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === idx
                    ? "w-4 bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-600 dark:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter for Desktop */}
          <div className="hidden md:block text-sm text-gray-400 dark:text-gray-600">
            {currentIndex + 1} / {maxIndex + 1}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;