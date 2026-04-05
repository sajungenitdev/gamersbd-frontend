// components/RecentUploads.tsx
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ShoppingCartIcon,
  ClockIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";

// Sample recent uploads data
const recentUploads = [
  {
    id: 1,
    name: "Cyberpunk 2077",
    category: "Action RPG",
    price: 1299,
    originalPrice: 1599,
    discount: 20,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/01/egs-cyberpunk2077-cdprojektred-g1a-13-02-24-22-1920x1080-dd4dcc601c17-300x375.jpg",
    uploadDate: "2 hours ago",
  },
  {
    id: 2,
    name: "Final Fantasy VII",
    category: "RPG",
    price: 1799,
    originalPrice: 2199,
    discount: 18,
    image:
      "https://gamersbd.com/wp-content/uploads/2015/12/egs-finalfantasyviiremakeintergrade-squareenix-g1a-01-1920x1080-05bc7f9ce725-300x375.jpg",
    uploadDate: "5 hours ago",
  },
  {
    id: 3,
    name: "SIFU",
    category: "Fighting",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    image:
      "https://gamersbd.com/wp-content/uploads/2015/12/egs-sifustandardedition-sloclap-g1a-06-1920x1080-b45863e5563b-300x375.jpg",
    uploadDate: "1 day ago",
  },
  {
    id: 4,
    name: "Elden Ring",
    category: "Action RPG",
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    image:
      "https://gamersbd.com/wp-content/uploads/2022/06/b4dc4-24-2-300x375.jpg",
    uploadDate: "2 days ago",
  },
  {
    id: 5,
    name: "God of War",
    category: "Action",
    price: 1499,
    originalPrice: 1899,
    discount: 21,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/03/egs-cyberpunk2077-cdprojektred-g1a-03-1920x1080-c25ac94167df-300x375.jpg",
    uploadDate: "3 days ago",
  },
  {
    id: 6,
    name: "Spider-Man 2",
    category: "Action Adventure",
    price: 2199,
    originalPrice: 2599,
    discount: 15,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/01/egs-cyberpunk2077-cdprojektred-g1a-13-02-24-22-1920x1080-dd4dcc601c17-300x375.jpg",
    uploadDate: "4 days ago",
  },
  {
    id: 7,
    name: "The Last of Us",
    category: "Survival",
    price: 1699,
    originalPrice: 1999,
    discount: 15,
    image:
      "https://gamersbd.com/wp-content/uploads/2015/12/egs-finalfantasyviiremakeintergrade-squareenix-g1a-01-1920x1080-05bc7f9ce725-300x375.jpg",
    uploadDate: "5 days ago",
  },
];

const RecentUploads = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [loadingTimeout, setLoadingTimeout] = useState<{
    [key: number]: boolean;
  }>({});
  const [itemsToShow, setItemsToShow] = useState(4);

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

  const maxIndex = Math.max(0, recentUploads.length - itemsToShow);

  // Reset currentIndex if it exceeds maxIndex
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  // Set timeout for each image to prevent infinite loading
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    recentUploads.forEach((product) => {
      const timer = setTimeout(() => {
        if (!imagesLoaded[product.id] && !imageErrors[product.id]) {
          setLoadingTimeout((prev) => ({ ...prev, [product.id]: true }));
          setImagesLoaded((prev) => ({ ...prev, [product.id]: true })); // Force mark as loaded
          console.log(`Image ${product.id} loading timed out`);
        }
      }, 5000); // 5 second timeout

      timers.push(timer);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [imagesLoaded, imageErrors]);

  // Preload images on component mount
  useEffect(() => {
    recentUploads.forEach((product) => {
      const img = new Image();
      img.src = product.image;
      img.onload = () => handleImageLoad(product.id);
      img.onerror = () => handleImageError(product.id);
    });
  }, []);

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

  return (
    <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl md:text-4xl text-white dark:text-black">
                Top New Releases
              </h2>
            </div>
            <p className="text-gray-400 dark:text-gray-600">
              Freshly added games and products
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
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
        <div className="relative group">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6 py-5"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {recentUploads.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-full"
                  style={{
                    flexBasis: `calc(${100 / itemsToShow}% - ${
                      itemsToShow > 1 ? 24 : 0
                    }px)`,
                  }}
                >
                  <div className="relative group/card overflow-hidden rounded-2xl transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-800 dark:bg-gray-200">
                      {/* Loading Spinner */}
                      {!imagesLoaded[item.id] &&
                        !imageErrors[item.id] &&
                        !loadingTimeout[item.id] && (
                          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}

                      {/* Error Fallback */}
                      {imageErrors[item.id] && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                          <div className="text-center">
                            <div className="text-gray-400 text-xs">
                              Failed to load
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Timeout Fallback */}
                      {loadingTimeout[item.id] &&
                        !imagesLoaded[item.id] &&
                        !imageErrors[item.id] && (
                          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                            <div className="text-center">
                              <div className="text-gray-400 text-xs">
                                Taking too long
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`absolute inset-0 w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-500 ${
                          imagesLoaded[item.id] && !imageErrors[item.id]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        onLoad={() => handleImageLoad(item.id)}
                        onError={() => handleImageError(item.id)}
                        loading="lazy"
                      />

                      {/* Discount Badge - Show if image loaded or timed out */}
                      {(imagesLoaded[item.id] || loadingTimeout[item.id]) &&
                        !imageErrors[item.id] && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                            -{calculateDiscount(item.price, item.originalPrice)}
                            %
                          </div>
                        )}

                      {/* Upload Time Badge - Show if image loaded or timed out */}
                      {(imagesLoaded[item.id] || loadingTimeout[item.id]) &&
                        !imageErrors[item.id] && (
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-20">
                            <ClockIcon className="w-3 h-3" />
                            <span>{item.uploadDate}</span>
                          </div>
                        )}

                      {/* New Arrival Overlay for very recent items - Show if image loaded or timed out */}
                      {(imagesLoaded[item.id] || loadingTimeout[item.id]) &&
                        !imageErrors[item.id] &&
                        item.uploadDate.includes("hour") && (
                          <div className="absolute inset-0 border-2 border-[#d88616] rounded-2xl pointer-events-none z-20" />
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-gray-400 dark:text-gray-600">
                          {item.category}
                        </p>
                        <button
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className="p-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                          aria-label={`Add ${item.name} to wishlist`}
                        >
                          <HeartIcon
                            className={`w-4 h-4 ${
                              favorites.includes(item.id)
                                ? "fill-red-500 text-red-500"
                                : "text-white dark:text-black"
                            }`}
                          />
                        </button>
                      </div>

                      <h3 className="text-lg font-normal text-white dark:text-black mb-2">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-white dark:text-black font-semibold text-lg">
                          ${item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 dark:text-gray-600 line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button className="w-full mt-4 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center justify-center gap-2">
                        <ShoppingCartIcon className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Show only if needed */}
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

        {/* Progress Bar */}
        <div className="mt-8 flex justify-center">
          <div className="w-48 h-1 bg-gray-800 dark:bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d88616] dark:bg-[#d88616] rounded-full transition-all duration-300"
              style={{
                width:
                  maxIndex > 0 ? `${(currentIndex / maxIndex) * 100}%` : "0%",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentUploads;
