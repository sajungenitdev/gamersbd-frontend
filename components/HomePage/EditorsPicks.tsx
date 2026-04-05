// components/EditorsPicks.tsx
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

// Sample editor's picks data
const editorPicks = [
  {
    id: 1,
    name: "SIFU",
    category: "testtest product",
    price: 456,
    originalPrice: 760,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    editorRating: 4.8,
    reviews: 234,
    badge: "Editor's Choice",
    inStock: 15,
  },
  {
    id: 2,
    name: "Baseball Cap",
    category: "Accessories",
    price: 864,
    originalPrice: 1080,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    editorRating: 4.5,
    reviews: 156,
    badge: "Trending",
    inStock: 8,
  },
  {
    id: 3,
    name: "Block Blouse",
    category: "Contemporary",
    price: 300,
    originalPrice: 500,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1624206112918-f140f087f9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    editorRating: 4.7,
    reviews: 312,
    badge: "Best Seller",
    inStock: 23,
  },
  {
    id: 4,
    name: "Daiki Blouse",
    category: "Contemporary",
    price: 500,
    originalPrice: 650,
    discount: 23,
    image:
      "https://images.unsplash.com/photo-1614251056216-f1d4b13507f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    editorRating: 4.6,
    reviews: 198,
    badge: "Staff Pick",
    inStock: 12,
  },
  {
    id: 5,
    name: "Billfold Wallet",
    category: "Accessories",
    price: 540,
    originalPrice: 600,
    discount: 10,
    image:
      "https://images.unsplash.com/photo-1627222784012-94ef2c4c81c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    editorRating: 4.4,
    reviews: 89,
    badge: "Popular",
    inStock: 5,
  },
  {
    id: 6,
    name: "Crochet Cardigan",
    category: "Contemporary",
    price: 730,
    originalPrice: 912,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    editorRating: 4.9,
    reviews: 445,
    badge: "Top Rated",
    inStock: 18,
  },
  {
    id: 7,
    name: "Dress",
    category: "Contemporary",
    price: 470,
    originalPrice: 670,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    editorRating: 4.5,
    reviews: 167,
    badge: "Limited Edition",
    inStock: 3,
  },
];

const EditorsPicks = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [loadingTimeout, setLoadingTimeout] = useState<{ [key: number]: boolean }>({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showQuickView, setShowQuickView] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filter options
  const filters = [
    { id: "all", label: "All Picks" },
    { id: "trending", label: "Trending" },
    { id: "bestseller", label: "Best Seller" },
    { id: "limited", label: "Limited" },
  ];

  // Filter products based on active filter
  const getFilteredProducts = () => {
    if (activeFilter === "all") return editorPicks;
    if (activeFilter === "trending")
      return editorPicks.filter(
        (p) => p.badge === "Trending" || p.badge === "Popular",
      );
    if (activeFilter === "bestseller")
      return editorPicks.filter(
        (p) => p.badge === "Best Seller" || p.badge === "Top Rated",
      );
    if (activeFilter === "limited")
      return editorPicks.filter((p) => p.inStock < 10);
    return editorPicks;
  };

  const filteredProducts = getFilteredProducts();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsToShow(4);
      else if (window.innerWidth >= 768) setItemsToShow(2);
      else setItemsToShow(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, filteredProducts.length - itemsToShow);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex, filteredProducts.length]);

  // Set timeout for each image to prevent infinite loading
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    filteredProducts.forEach((product) => {
      const timer = setTimeout(() => {
        if (!imagesLoaded[product.id] && !imageErrors[product.id]) {
          setLoadingTimeout((prev) => ({ ...prev, [product.id]: true }));
          setImagesLoaded((prev) => ({ ...prev, [product.id]: true })); // Force mark as loaded
          console.log(`Image ${product.id} loading timed out`);
        }
      }, 5000); // 5 second timeout
      
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [filteredProducts, imagesLoaded, imageErrors]);

  // Preload images on component mount and when filter changes
  useEffect(() => {
    filteredProducts.forEach((product) => {
      const img = new Image();
      img.src = product.image;
      img.onload = () => handleImageLoad(product.id);
      img.onerror = () => handleImageError(product.id);
    });
  }, [filteredProducts]);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  return (
    <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl text-white dark:text-black">
              Editor's Picks
            </h2>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25"
                    : "bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-full"
                  style={{
                    flexBasis: `calc(${100 / itemsToShow}% - ${
                      itemsToShow > 1
                        ? (24 * (itemsToShow - 1)) / itemsToShow
                        : 0
                    }px)`,
                  }}
                >
                  <div className="group relative bg-[#2A2A2A] dark:bg-gray-50 rounded-xl overflow-hidden border border-gray-800 dark:border-gray-200 hover:border-gray-700 dark:hover:border-gray-300 transition-all">
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                          product.badge === "Editor's Choice"
                            ? "bg-purple-500 text-white"
                            : product.badge === "Trending"
                              ? "bg-orange-500 text-white"
                              : product.badge === "Best Seller"
                                ? "bg-green-500 text-white"
                                : product.badge === "Top Rated"
                                  ? "bg-amber-500 text-white"
                                  : "bg-orange-500 text-white"
                        }`}
                      >
                        {product.badge}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <HeartIcon
                        className={`w-4 h-4 ${
                          favorites.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        }`}
                      />
                    </button>

                    {/* Quick View Button */}
                    <button
                      onClick={() => setShowQuickView(product.id)}
                      className="absolute top-3 right-14 z-20 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <EyeIcon className="w-4 h-4 text-white" />
                    </button>

                    {/* Image Container */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-800 dark:bg-gray-200">
                      {/* Loading Spinner */}
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
                        className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${
                          imagesLoaded[product.id] && !imageErrors[product.id]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        onLoad={() => handleImageLoad(product.id)}
                        onError={() => handleImageError(product.id)}
                        loading="lazy"
                      />

                      {/* Discount Badge - Show if image loaded or timed out */}
                      {(imagesLoaded[product.id] || loadingTimeout[product.id]) && !imageErrors[product.id] && (
                        <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                          -
                          {calculateDiscount(
                            product.price,
                            product.originalPrice,
                          )}
                          %
                        </div>
                      )}

                      {/* Stock Badge - Show if image loaded or timed out */}
                      {(imagesLoaded[product.id] || loadingTimeout[product.id]) && 
                        !imageErrors[product.id] && product.inStock < 5 && (
                          <div className="absolute bottom-3 right-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full z-20">
                            Only {product.inStock} left
                          </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-400 dark:text-gray-600">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs text-white dark:text-black font-medium">
                            {product.editorRating}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-600">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white dark:text-black mb-2 line-clamp-1">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-white dark:text-black">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-600 line-through">
                          ${product.originalPrice}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <button className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                        <ShoppingCartIcon className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}

          {currentIndex < maxIndex && (
            <button
              onClick={nextSlide}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all ${
                index === currentIndex
                  ? "w-8 h-2 bg-orange-600 rounded-full"
                  : "w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full hover:bg-gray-500 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black transition-colors group">
            <span>View All Editor's Picks</span>
            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2A2A2A] dark:bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white dark:text-black">
                  Quick View
                </h3>
                <button
                  onClick={() => setShowQuickView(null)}
                  className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-200 flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                >
                  <span className="text-white dark:text-black">✕</span>
                </button>
              </div>
              <p className="text-gray-400 dark:text-gray-600">
                Product details will appear here...
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditorsPicks;