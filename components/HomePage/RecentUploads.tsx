// components/RecentUploads.tsx
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ShoppingCartIcon,
  ClockIcon,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useCart } from "../../app/contexts/CartContext";
import { useUserAuth } from "../../app/contexts/UserAuthContext";
import { useWishlist } from "../../app/contexts/WishlistContext";

// Product type based on your API response
interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  currency: string;
  category: {
    _id: string;
    name: string;
  };
  brand: string;
  mainImage: string;
  images: string[];
  stock: number;
  availability: string;
  type: string;
  offerType: "featured" | "sale" | "new" | "none";
  isFeatured: boolean;
  offerBadge: string;
  offerBadgeColor: string;
  isOnSale: boolean;
  discountPercentage: number;
  rating: string;
  isActive: boolean;
  soldCount: number;
  finalPrice: number;
  offerDisplay: {
    type: string;
    badge: string;
    color: string;
    priority: number;
  };
  createdAt: string;
  updatedAt: string;
}

const RecentUploads = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [loadingTimeout, setLoadingTimeout] = useState<{
    [key: string]: boolean;
  }>({});
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Get cart and wishlist contexts
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, checkInWishlist } =
    useWishlist();
  const { user } = useUserAuth();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

  // Helper function to get currency symbol
  const getCurrencySymbol = (currency: string | undefined) => {
    switch (currency) {
      case "BDT":
        return "৳";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return "$";
    }
  };

  // Helper function to format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          "Fetching recent products from:",
          `${API_URL}/api/products`,
        );

        const response = await fetch(`${API_URL}/api/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error("Invalid response format");
        }

        // Sort products by createdAt date (newest first) and take top 10
        const recentProducts = [...data.data]
          .sort((a: Product, b: Product) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .slice(0, 10);

        setProducts(recentProducts);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(
          err.message ||
            "Failed to load products. Please check your connection.",
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

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

  const maxIndex = Math.max(0, products.length - itemsToShow);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  // Set timeout for each image to prevent infinite loading
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    products.forEach((product) => {
      const timer = setTimeout(() => {
        if (!imagesLoaded[product.id] && !imageErrors[product.id]) {
          setLoadingTimeout((prev) => ({ ...prev, [product.id]: true }));
          setImagesLoaded((prev) => ({ ...prev, [product.id]: true }));
        }
      }, 5000);

      timers.push(timer);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [products, imagesLoaded, imageErrors]);

  // Preload images
  useEffect(() => {
    products.forEach((product) => {
      const imageUrl = product.mainImage || product.images?.[0];
      if (imageUrl && imageUrl !== "/placeholder.jpg") {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => handleImageLoad(product.id);
        img.onerror = () => handleImageError(product.id);
      }
    });
  }, [products]);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleImageLoad = (productId: string) => {
    setImagesLoaded((prev) => ({ ...prev, [productId]: true }));
  };

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
    setImagesLoaded((prev) => ({ ...prev, [productId]: true }));
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const availableStock = product.stock ?? 0;
    if (availableStock <= 0) {
      toast.error("Out of stock");
      return;
    }

    setAddingToCart(product.id);

    const cartProduct = {
      _id: product._id,
      name: product.name,
      price: product.finalPrice || product.price,
      inStock: availableStock > 0,
      image: product.mainImage || product.images?.[0] || "",
      quantity: 1,
    };

    const success = await addToCart(cartProduct, 1);

    if (success) {
      toast.success("Added to cart!");
    } else {
      toast.error("Failed to add to cart");
    }

    setAddingToCart(null);
  };

  const handleToggleWishlist = async (
    product: Product,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    const isInWishlist = checkInWishlist(product._id);

    if (isInWishlist) {
      const wishlistItem = wishlist?.items.find(
        (item) => item.product._id === product._id,
      );
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem._id);
        toast.success("Removed from wishlist");
      }
    } else {
      await addToWishlist(product._id);
      toast.success("Added to wishlist");
    }
  };

  const calculateDiscount = (product: Product) => {
    if (product.discountPercentage > 0) {
      return product.discountPercentage;
    }
    if (product.isOnSale && product.finalPrice < product.price) {
      return Math.round(
        ((product.price - product.finalPrice) / product.price) * 100,
      );
    }
    return 0;
  };

  const getProductImage = (product: Product) => {
    return product.mainImage || product.images?.[0] || "/placeholder.jpg";
  };

  const isNewArrival = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / 3600000;
    return diffHours < 24; // Less than 24 hours old
  };

  if (loading) {
    return (
      <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
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
          </div>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400 dark:text-gray-600">
                Loading recent releases...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
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
          </div>
          <div className="text-center py-12 bg-gray-800/50 dark:bg-gray-100/50 rounded-xl">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-500 mb-4">Failed to load recent releases</p>
            <p className="text-gray-400 dark:text-gray-600 text-sm mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
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
          </div>
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 dark:text-gray-600">
              No recent releases available.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Check back soon for new products!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
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
        <div className="relative group">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6 py-5"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {products.map((product) => {
                const discount = calculateDiscount(product);
                const productImage = getProductImage(product);
                const isImageLoaded = imagesLoaded[product.id];
                const hasImageError = imageErrors[product.id];
                const hasTimeout = loadingTimeout[product.id];
                const stock = product.stock ?? 0;
                const finalPrice = product.finalPrice || product.price;
                const originalPrice = product.price;
                const isInWishlist = checkInWishlist(product._id);
                const relativeTime = getRelativeTime(product.createdAt);
                const isNew = isNewArrival(product.createdAt);

                return (
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
                    <Link href={`/product/${product.id}`}>
                      <div className="relative group/card overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer">
                        {/* Product Image */}
                        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-800 dark:bg-gray-200">
                          {/* Loading Spinner */}
                          {!isImageLoaded && !hasImageError && !hasTimeout && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                            </div>
                          )}

                          {/* Error Fallback */}
                          {hasImageError && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                              <div className="text-center">
                                <div className="text-gray-400 text-xs">
                                  Failed to load
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Timeout Fallback */}
                          {hasTimeout && !isImageLoaded && !hasImageError && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800 dark:bg-gray-200">
                              <div className="text-center">
                                <div className="text-gray-400 text-xs">
                                  Taking too long
                                </div>
                              </div>
                            </div>
                          )}

                          <img
                            src={productImage}
                            alt={product.name}
                            className={`absolute inset-0 w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-500 ${
                              isImageLoaded && !hasImageError
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                            onLoad={() => handleImageLoad(product.id)}
                            onError={() => handleImageError(product.id)}
                            loading="lazy"
                          />

                          {/* Discount Badge */}
                          {discount > 0 &&
                            (isImageLoaded || hasTimeout) &&
                            !hasImageError && (
                              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                                -{discount}%
                              </div>
                            )}

                          {/* Upload Time Badge */}
                          {(isImageLoaded || hasTimeout) && !hasImageError && (
                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-20">
                              <ClockIcon className="w-3 h-3" />
                              <span>{relativeTime}</span>
                            </div>
                          )}

                          {/* New Arrival Overlay for very recent items */}
                          {isNew &&
                            (isImageLoaded || hasTimeout) &&
                            !hasImageError && (
                              <div className="absolute inset-0 border-2 border-[#d88616] rounded-2xl pointer-events-none z-20" />
                            )}

                          {/* Stock Badge */}
                          {stock > 0 &&
                            stock < 10 &&
                            (isImageLoaded || hasTimeout) && (
                              <div className="absolute bottom-3 right-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full z-20">
                                Only {stock} left
                              </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-gray-400 dark:text-gray-600">
                              {product.category?.name || "Product"}
                            </p>
                            <button
                              onClick={(e) => handleToggleWishlist(product, e)}
                              className="p-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                              aria-label={`Add ${product.name} to wishlist`}
                            >
                              <HeartIcon
                                className={`w-4 h-4 ${
                                  isInWishlist
                                    ? "fill-red-500 text-red-500"
                                    : "text-white dark:text-black"
                                }`}
                              />
                            </button>
                          </div>

                          <h3 className="text-lg font-normal text-white dark:text-black mb-2 line-clamp-1">
                            {product.name}
                          </h3>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white dark:text-black font-semibold text-lg">
                              {getCurrencySymbol(product.currency)}
                              {finalPrice.toFixed(2)}
                            </span>
                            {discount > 0 && (
                              <span className="text-sm text-gray-400 dark:text-gray-600 line-through">
                                {getCurrencySymbol(product.currency)}
                                {originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={stock <= 0 || addingToCart === product.id}
                            className="w-full mt-4 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {addingToCart === product.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <ShoppingCartIcon className="w-4 h-4" />
                                {stock <= 0 ? "Out of Stock" : "Add to Cart"}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          {products.length > itemsToShow && currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}

          {products.length > itemsToShow && currentIndex < maxIndex && (
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
        {products.length > itemsToShow && (
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
        )}
      </div>
    </section>
  );
};

export default RecentUploads;
