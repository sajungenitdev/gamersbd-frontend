// components/ProductSlider.tsx
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  Loader2,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useCart } from "../../app/contexts/CartContext";

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
}

const ProductSlider = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
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
  const sliderRef = useRef<HTMLDivElement>(null);

  // Get cart context
  const { addToCart } = useCart();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();

        // Filter products that are on sale (isOnSale === true)
        const saleProducts = data.data.filter(
          (product: Product) => product.isOnSale === true,
        );

        setProducts(saleProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

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
          setImagesLoaded((prev) => ({ ...prev, [product.id]: true }));
        }
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [products, imagesLoaded, imageErrors]);

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
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
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

  // Preload images
  useEffect(() => {
    products.forEach((product) => {
      const img = new Image();
      img.src = getProductImage(product);
      img.onload = () => handleImageLoad(product.id);
      img.onerror = () => handleImageError(product.id);
    });
  }, [products]);

  if (loading) {
    return (
      <section className="py-12 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl text-white dark:text-black">
                MEGA Sale Spotlight
              </h2>
            </div>
          </div>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400 dark:text-gray-600">
                Loading products...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl text-white dark:text-black">
                MEGA Sale Spotlight
              </h2>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500">Error loading products: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl text-white dark:text-black">
                MEGA Sale Spotlight
              </h2>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-600">
              No sale products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl text-white dark:text-black">
              MEGA Sale Spotlight
            </h2>
            <p className="text-gray-400 dark:text-gray-600 mt-1">
              Don't miss out on these amazing deals!
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
            {products.map((product) => {
              const discount = calculateDiscount(product);
              const productImage = getProductImage(product);
              const isImageLoaded = imagesLoaded[product.id];
              const hasImageError = imageErrors[product.id];
              const hasTimeout = loadingTimeout[product.id];
              const stock = product.stock ?? 0;
              const finalPrice = product.finalPrice || product.price;
              const originalPrice = product.price;

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
                    <div className="relative group overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer">
                      {/* Product Image with Loading State */}
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
                          className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${
                            isImageLoaded && !hasImageError
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onLoad={() => handleImageLoad(product.id)}
                          onError={() => handleImageError(product.id)}
                          loading="lazy"
                        />

                        {/* Discount Badge */}
                        {discount > 0 && (isImageLoaded || hasTimeout) && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                            -{discount}%
                          </div>
                        )}

                        {/* Sale Badge */}
                        {product.isOnSale && (isImageLoaded || hasTimeout) && (
                          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                            SALE
                          </div>
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
                        <p className="text-sm text-gray-400 dark:text-gray-600 mb-1">
                          {product.category?.name || "Uncategorized"}
                        </p>

                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white dark:text-black line-clamp-1">
                            {product.name}
                          </h3>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={stock <= 0 || addingToCart === product.id}
                            className="p-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            {addingToCart === product.id ? (
                              <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                            ) : (
                              <ShoppingCartIcon className="w-4 h-4 text-white dark:text-black" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-white dark:text-black font-normal text-lg">
                            {product.currency || "$"}
                            {finalPrice.toFixed(2)}
                          </span>
                          {product.isOnSale && finalPrice < originalPrice && (
                            <>
                              <span className="text-sm text-gray-400 dark:text-gray-600 line-through">
                                {product.currency || "$"}
                                {originalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-[#d88616] dark:text-green-600 font-medium">
                                Save {(originalPrice - finalPrice).toFixed(2)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar and Pagination */}
        {products.length > itemsToShow && (
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
              {Array.from({ length: Math.min(maxIndex + 1, 10) }).map(
                (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentIndex === idx
                        ? "w-4 bg-orange-600 dark:bg-blue-500"
                        : "bg-gray-600 dark:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ),
              )}
            </div>

            {/* Slide Counter for Desktop */}
            <div className="hidden md:block text-sm text-gray-400 dark:text-gray-600">
              {currentIndex + 1} / {maxIndex + 1}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSlider;
