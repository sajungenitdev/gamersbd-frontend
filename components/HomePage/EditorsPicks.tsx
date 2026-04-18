// components/EditorsPicks.tsx
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
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

const EditorsPicks = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [activeFilter, setActiveFilter] = useState("all");
  const [showQuickView, setShowQuickView] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Get cart context
  const { addToCart } = useCart();

  // Filter options
  const filters = [
    { id: "all", label: "All Picks" },
    { id: "featured", label: "Featured" },
    { id: "sale", label: "On Sale" },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://gamersbd-server.onrender.com/api/products");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();

        // Filter products that are either featured or have offerType "featured"
        const featuredProducts = data.data.filter(
          (product: Product) =>
            product.isFeatured === true ||
            product.offerType === "featured" ||
            product.offerDisplay?.type === "featured",
        );

        setProducts(featuredProducts);
        setFilteredProducts(featuredProducts);
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
  }, []);

  // Apply filters
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredProducts(products);
    } else if (activeFilter === "featured") {
      setFilteredProducts(
        products.filter(
          (p) => p.isFeatured === true || p.offerType === "featured",
        ),
      );
    } else if (activeFilter === "sale") {
      setFilteredProducts(
        products.filter((p) => p.isOnSale === true || p.discountPercentage > 0),
      );
    }
    setCurrentIndex(0);
  }, [activeFilter, products]);

  // Responsive items to show
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

  // Preload images
  useEffect(() => {
    filteredProducts.forEach((product) => {
      const imageUrl = product.mainImage || product.images?.[0];
      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => handleImageLoad(product.id);
        img.onerror = () => handleImageError(product.id);
      }
    });
  }, [filteredProducts]);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
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

    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }

    setAddingToCart(product.id);

    const cartProduct = {
      _id: product._id,
      name: product.name,
      price: product.finalPrice || product.price,
      inStock: product.stock > 0,
      image: product.mainImage || product.images?.[0] || "",
      quantity: 1,
    };

    const success = await addToCart(cartProduct, 1);

    setAddingToCart(null);
  };

  const getBadgeColor = (product: Product) => {
    if (product.offerBadgeColor) {
      switch (product.offerBadgeColor) {
        case "orange":
          return "bg-orange-500";
        case "purple":
          return "bg-purple-500";
        case "green":
          return "bg-green-500";
        case "blue":
          return "bg-blue-500";
        default:
          return "bg-orange-500";
      }
    }
    return "bg-orange-500";
  };

  const getBadgeText = (product: Product) => {
    if (product.offerBadge) return product.offerBadge;
    if (product.offerType === "featured") return "Editor's Pick";
    if (product.isOnSale) return "On Sale";
    if (product.discountPercentage > 0)
      return `${product.discountPercentage}% OFF`;
    return "Featured";
  };

  if (error) {
    return (
      <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header - Always visible */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl text-white dark:text-black font-bold">
                Editor's Picks
              </h2>
              <p className="text-gray-400 dark:text-gray-600 mt-2">
                Curated just for you
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
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

          {/* Error Message */}
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

  return (
    <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - Always visible, never hidden */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl text-white dark:text-black font-bold">
              Editor's Picks
            </h2>
            <p className="text-gray-400 dark:text-gray-600 mt-2">
              Curated just for you
            </p>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
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

        {/* Loading State - Shows in content area only, header stays visible */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400 dark:text-gray-600">
                Loading products...
              </p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No featured products available.</p>
          </div>
        ) : (
          <>
            {/* Slider */}
            <div ref={sliderRef} className="relative group">
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-out gap-6"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                  }}
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
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
                        <div className="group/product relative bg-[#2A2A2A] dark:bg-gray-50 rounded-xl overflow-hidden border border-gray-800 dark:border-gray-200 hover:border-gray-700 dark:hover:border-gray-300 transition-all cursor-pointer">
                          {/* Badge */}
                          <div className="absolute top-3 left-3 z-20">
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded-full ${getBadgeColor(
                                product,
                              )} text-white`}
                            >
                              {getBadgeText(product)}
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
                            onClick={(e) => {
                              e.preventDefault();
                              setShowQuickView(product.id);
                            }}
                            className="absolute top-3 right-14 z-20 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover/product:opacity-100"
                          >
                            <EyeIcon className="w-4 h-4 text-white" />
                          </button>

                          {/* Image Container */}
                          <div className="relative w-full aspect-square overflow-hidden bg-gray-800 dark:bg-gray-200">
                            {!imagesLoaded[product.id] && (
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                              </div>
                            )}

                            <img
                              src={
                                product.mainImage ||
                                product.images?.[0] ||
                                "/placeholder.jpg"
                              }
                              alt={product.name}
                              className={`w-full h-full object-cover transform group-hover/product:scale-110 transition-transform duration-700 ${
                                imagesLoaded[product.id]
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              onLoad={() => handleImageLoad(product.id)}
                              onError={() => handleImageError(product.id)}
                              loading="lazy"
                            />

                            {/* Discount Badge */}
                            {(product.isOnSale ||
                              product.discountPercentage > 0) && (
                              <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                                -
                                {product.discountPercentage ||
                                  Math.round(
                                    ((product.price - product.finalPrice) /
                                      product.price) *
                                      100,
                                  )}
                                %
                              </div>
                            )}

                            {/* Stock Badge */}
                            {product.stock < 10 && product.stock > 0 && (
                              <div className="absolute bottom-3 right-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full z-20">
                                Only {product.stock} left
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-gray-400 dark:text-gray-600">
                                {product.category?.name || "Uncategorized"}
                              </p>
                              {product.rating && (
                                <div className="flex items-center gap-1">
                                  <StarIcon className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                  <span className="text-xs text-white dark:text-black font-medium">
                                    {product.rating}
                                  </span>
                                </div>
                              )}
                            </div>

                            <h3 className="text-lg font-semibold text-white dark:text-black mb-2 line-clamp-1">
                              {product.name}
                            </h3>

                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-xl font-bold text-white dark:text-black">
                                {product.currency === "BDT"
                                  ? "৳"
                                  : product.currency === "USD"
                                    ? "$"
                                    : product.currency || "$"}
                                {(product.finalPrice || product.price).toFixed(
                                  2,
                                )}
                              </span>
                              {product.isOnSale &&
                                product.price !== product.finalPrice && (
                                  <span className="text-sm text-gray-400 dark:text-gray-600 line-through">
                                    {product.currency || "$"}
                                    {product.price.toFixed(2)}
                                  </span>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={
                                product.stock <= 0 ||
                                addingToCart === product.id
                              }
                              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {addingToCart === product.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <ShoppingCartIcon className="w-4 h-4" />
                                  {product.stock <= 0
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {currentIndex > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              )}

              {currentIndex < maxIndex && (
                <button
                  onClick={nextSlide}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Progress Dots */}
            {maxIndex > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.min(maxIndex + 1, 10) }).map(
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`transition-all ${
                        index === currentIndex
                          ? "w-8 h-2 bg-orange-600 rounded-full"
                          : "w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full hover:bg-gray-500"
                      }`}
                    />
                  ),
                )}
              </div>
            )}

            {/* View All Link */}
            <div className="text-center mt-8">
              <Link
                href="/shop?filter=featured"
                className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black transition-colors group"
              >
                <span>View All Editor's Picks</span>
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2A2A2A] dark:bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const product = products.find((p) => p.id === showQuickView);
              return (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white dark:text-black">
                      {product?.name}
                    </h3>
                    <button
                      onClick={() => setShowQuickView(null)}
                      className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-200 flex items-center justify-center hover:bg-gray-700"
                    >
                      <span className="text-white dark:text-black">✕</span>
                    </button>
                  </div>
                  <img
                    src={product?.mainImage || product?.images?.[0]}
                    alt={product?.name}
                    className="w-full rounded-lg mb-4"
                  />
                  <p className="text-gray-400 dark:text-gray-600 mb-4">
                    {product?.description || product?.shortDescription}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-white dark:text-black">
                      {product?.currency || "$"}
                      {(product?.finalPrice || product?.price)?.toFixed(2)}
                    </span>
                    {product?.isOnSale &&
                      product?.price !== product?.finalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {product?.currency || "$"}
                          {product?.price?.toFixed(2)}
                        </span>
                      )}
                  </div>
                  <button
                    onClick={() => {
                      if (product) {
                        handleAddToCart(product, {} as React.MouseEvent);
                        setShowQuickView(null);
                      }
                    }}
                    disabled={!product || (product.stock ?? 0) <= 0}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {(product?.stock ?? 0) <= 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
};

export default EditorsPicks;
