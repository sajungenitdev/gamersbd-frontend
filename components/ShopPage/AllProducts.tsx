"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Sample product data with optimized image URLs (using smaller sizes)
const products = [
  {
    id: 1,
    name: "Cyberpunk 2077",
    category: "Action RPG",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 234,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/01/egs-cyberpunk2077-cdprojektred-g1a-13-02-24-22-1920x1080-dd4dcc601c17-300x375.jpg",
    badge: "Hot",
    inStock: true,
  },
  {
    id: 2,
    name: "Final Fantasy VII",
    category: "RPG",
    price: 1799,
    originalPrice: 2199,
    rating: 4.9,
    reviews: 445,
    image:
      "https://gamersbd.com/wp-content/uploads/2015/12/egs-finalfantasyviiremakeintergrade-squareenix-g1a-01-1920x1080-05bc7f9ce725-300x375.jpg",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 3,
    name: "SIFU",
    category: "Fighting",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 189,
    image:
      "https://gamersbd.com/wp-content/uploads/2015/12/egs-sifustandardedition-sloclap-g1a-06-1920x1080-b45863e5563b-300x375.jpg",
    badge: "New",
    inStock: true,
  },
  {
    id: 4,
    name: "Elden Ring",
    category: "Action RPG",
    price: 1999,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 567,
    image:
      "https://gamersbd.com/wp-content/uploads/2022/06/b4dc4-24-2-300x375.jpg",
    badge: "Editor's Choice",
    inStock: true,
  },
  {
    id: 5,
    name: "God of War",
    category: "Action",
    price: 1499,
    originalPrice: 1899,
    rating: 4.8,
    reviews: 345,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/03/egs-cyberpunk2077-cdprojektred-g1a-03-1920x1080-c25ac94167df-300x375.jpg",
    badge: "Popular",
    inStock: true,
  },
  {
    id: 6,
    name: "Spider-Man 2",
    category: "Action Adventure",
    price: 2199,
    originalPrice: 2599,
    rating: 4.8,
    reviews: 278,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/01/egs-cyberpunk2077-cdprojektred-g1a-13-02-24-22-1920x1080-dd4dcc601c17-300x375.jpg",
    badge: "New",
    inStock: false,
  },
  {
    id: 7,
    name: "The Last of Us",
    category: "Survival",
    price: 1699,
    originalPrice: 1999,
    rating: 4.9,
    reviews: 423,
    image:
      "https://gamersbd.com/wp-content/uploads/2015/12/egs-finalfantasyviiremakeintergrade-squareenix-g1a-01-1920x1080-05bc7f9ce725-300x375.jpg",
    badge: "Top Rated",
    inStock: true,
  },
  {
    id: 8,
    name: "Red Dead Redemption 2",
    category: "Action Adventure",
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    reviews: 678,
    image:
      "https://gamersbd.com/wp-content/uploads/2016/03/egs-cyberpunk2077-cdprojektred-g1a-03-1920x1080-c25ac94167df-300x375.jpg",
    badge: "Best Seller",
    inStock: true,
  },
];

// Accordion Section Component
const AccordionSection = ({
  title,
  children,
  defaultOpen = false,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-white hover:text-purple-400 transition-colors group"
      >
        <span className="font-normal font-inter text-sm">{title}</span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } group-hover:text-purple-400`}
        >
          {icon || <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Categories for filter
const categories = [
  "All Games",
  "Action RPG",
  "RPG",
  "Fighting",
  "Action",
  "Action Adventure",
  "Survival",
];

// Price ranges
const priceRanges = [
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 - $1000", min: 500, max: 1000 },
  { label: "$1000 - $1500", min: 1000, max: 1500 },
  { label: "$1500 - $2000", min: 1500, max: 2000 },
  { label: "Over $2000", min: 2000, max: 10000 },
];

// Optimized Image Component with lazy loading
const OptimizedImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src) {
    return (
      <div className="relative w-full h-full bg-[#1a1a1a] flex items-center justify-center">
        <XCircle className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#1a1a1a] overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
          <div className="text-center">
            <XCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Failed to load</p>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};

// Product Card Component
const ProductCard = React.memo(
  ({ product, favorites, toggleFavorite, onQuickView }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    const discountPercentage = useMemo(
      () =>
        Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        ),
      [product.price, product.originalPrice],
    );

    const badgeColors = useMemo(() => {
      const colors: Record<string, string> = {
        Hot: "from-red-500 to-red-600",
        New: "from-green-500 to-green-600",
        "Best Seller": "from-blue-500 to-blue-600",
        "Editor's Choice": "from-purple-500 to-purple-600",
      };
      return colors[product.badge] || "from-orange-500 to-orange-600";
    }, [product.badge]);

    return (
      <div
        className="group relative bg-[#2A2A2A] rounded-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-800/50 hover:border-purple-500/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`}>
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-[#1a1a1a] font-inter">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.badge && (
                <span
                  className={`px-3 py-1 text-xs font-normal rounded-full bg-gradient-to-r ${badgeColors} text-white shadow-lg shadow-black/20`}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Action Buttons - Modern Floating Design */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3 transition-all duration-300 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={onQuickView}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 border border-white/20 group/btn"
                title="Quick View"
              >
                <Eye className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                onClick={(e) => toggleFavorite(product.id, e)}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/90 transition-all duration-300 transform hover:scale-110 hover:-rotate-12 border border-white/20 group/btn"
                title={
                  favorites.includes(product.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    favorites.includes(product.id)
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-white group-hover/btn:scale-110"
                  }`}
                />
              </button>
            </div>

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-[#1a1a1a]/95 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center transform -translate-y-2">
                  <XCircle className="w-12 h-12 text-red-500/80 mx-auto mb-2" />
                  <span className="text-white/90 font-normal font-inter text-sm px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                    Out of Stock
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Product Info - Minimal Design */}
          <div className="p-5 font-inter">
            <p className="text-xs text-purple-400 mb-1 uppercase tracking-wider font-normal font-inter">
              {product.category}
            </p>

            <h3 className="text-lg font-normal text-white mb-3 line-clamp-1 group-hover:text-purple-400 transition-colors">
              {product.name}
            </h3>

            {/* Price Section */}
            <div className="flex items-baseline justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-1xl font-normal text-white">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button - Modern Gradient */}
            <button
              disabled={!product.inStock}
              className={`w-full py-2 rounded-md font-normal font-inter flex items-center justify-center gap-2 transition-all duration-300 ${
                product.inStock
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-[#1a1a1a] text-gray-500 cursor-not-allowed border border-gray-800"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
            </button>
          </div>
        </Link>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";

// Quick View Modal Component - With null checks
const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }: any) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setTimeout(() => setIsVisible(false), 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className={`relative bg-[#2A2A2A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800 transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-amber-600 transition-all duration-300 border border-gray-700 hover:border-amber-500 group"
          >
            <X className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:rotate-90 transition-all" />
          </button>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a1a] ring-1 ring-gray-800">
              <OptimizedImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-amber-400 font-normal font-inter mb-2 tracking-wide">
                  {product.category}
                </p>
                <h2 className="text-3xl font-normal text-white mb-4">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-normal text-white">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-sm font-normal font-inter text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      Save ${product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-400 font-normal font-inter">
                      In Stock - Ready to Ship
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-400 font-normal font-inter">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white text-lg">
                  Description
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Experience the ultimate gaming adventure with {product.name}.
                  This {product.category} game offers hours of entertainment
                  with stunning graphics and engaging gameplay.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white text-lg">Features</h3>
                <ul className="grid grid-cols-2 gap-3">
                  {[
                    "Immersive storyline",
                    "High-quality graphics",
                    "Multiplayer support",
                    "Regular updates",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-400"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    onAddToCart();
                    onClose();
                  }}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 rounded-xl font-normal font-inter flex items-center justify-center gap-2 transition-all duration-300 ${
                    product.inStock
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5"
                      : "bg-[#1a1a1a] text-gray-500 cursor-not-allowed border border-gray-800"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button className="px-6 py-4 border-2 border-gray-800 rounded-xl font-normal font-inter text-gray-300 hover:border-amber-600 hover:text-amber-400 transition-all duration-300 hover:bg-amber-600/10 group">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Tag Component
const FilterTag = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-900/30 text-amber-400 rounded-full text-xs border border-amber-500/30">
    {label}
    <X
      className="w-3 h-3 cursor-pointer hover:text-amber-300 transition-colors"
      onClick={onRemove}
    />
  </span>
);

// Skeleton Card for loading state
const SkeletonCard = () => (
  <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden border border-gray-800 animate-pulse">
    <div className="aspect-square bg-[#1a1a1a]" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-gray-700 rounded" />
      <div className="h-5 w-32 bg-gray-700 rounded" />
      <div className="h-8 w-24 bg-gray-700 rounded" />
      <div className="h-10 w-full bg-gray-700 rounded-xl" />
    </div>
  </div>
);

// No Results Component
const NoResults = ({ onClearFilters }: { onClearFilters: () => void }) => (
  <div className="text-center py-16 bg-[#2A2A2A] rounded-2xl border border-gray-800">
    <div className="mb-4">
      <Search className="w-16 h-16 text-gray-600 mx-auto" />
    </div>
    <h3 className="text-xl font-semibold font-inter text-white mb-2">
      No products found
    </h3>
    <p className="text-gray-400 mb-6">
      Try adjusting your filters or search query
    </p>
    <button
      onClick={onClearFilters}
      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
    >
      Clear All Filters
    </button>
  </div>
);

// Main Component
const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Games");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null,
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized filter function for better performance
  const filteredProducts = useMemo(() => {
    setIsLoading(true);
    const filtered = products.filter((product) => {
      if (
        selectedCategory !== "All Games" &&
        product.category !== selectedCategory
      )
        return false;
      if (selectedPriceRange) {
        const range = priceRanges.find((r) => r.label === selectedPriceRange);
        if (range && (product.price < range.min || product.price > range.max))
          return false;
      }
      if (selectedRating && Math.floor(product.rating) < selectedRating)
        return false;
      if (showInStockOnly && !product.inStock) return false;
      if (searchQuery) {
        return (
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setTimeout(() => setIsLoading(false), 300);
    return sorted;
  }, [
    selectedCategory,
    selectedPriceRange,
    selectedRating,
    showInStockOnly,
    searchQuery,
    sortBy,
  ]);

  const toggleFavorite = useCallback((id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory("All Games");
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setShowInStockOnly(false);
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#2A2A2A] rounded-xl text-white border border-gray-800 hover:border-amber-500/50 transition-colors"
          >
            <span className="flex items-center gap-2 font-inter">
              <SlidersHorizontal className="w-5 h-5" />
              Filters & Sort
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                mobileFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div
            className={`
  lg:w-64 flex-shrink-0
  ${mobileFilterOpen ? "block" : "hidden lg:block"}
`}
          >
            <div className="bg-[#2A2A2A] rounded-2xl p-6 sticky top-24 border border-gray-800 font-inter">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold font-inter text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] text-white rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Accordion Sections */}

              {/* Product Categories Accordion */}
              <AccordionSection
                title="Product Categories"
                defaultOpen={true}
                icon={<ChevronDown className="w-4 h-4" />}
              >
                <div className="space-y-2 max-h-60 font-inter overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4 accent-amber-600"
                      />
                      <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors flex-1">
                        {category}
                      </span>
                      <span className="text-xs text-gray-600">
                        (
                        {
                          products.filter((p) =>
                            category === "All Games"
                              ? true
                              : p.category === category,
                          ).length
                        }
                        )
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionSection>

              {/* Filter by Brand Accordion */}
              <AccordionSection
                title="Filter by Brand"
                defaultOpen={false}
                icon={<ChevronDown className="w-4 h-4" />}
              >
                <div className="space-y-2">
                  {["PlayStation", "Xbox", "Nintendo", "PC", "Mobile"].map(
                    (brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-amber-600 rounded"
                        />
                        <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors flex-1">
                          {brand}
                        </span>
                        <span className="text-xs text-gray-600">
                          ({Math.floor(Math.random() * 10) + 1})
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </AccordionSection>

              {/* Filter by Price Accordion */}
              <AccordionSection
                title="Filter by Price"
                defaultOpen={true}
                icon={<ChevronDown className="w-4 h-4" />}
              >
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === range.label}
                        onChange={() => setSelectedPriceRange(range.label)}
                        className="w-4 h-4 accent-amber-600"
                      />
                      <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors flex-1">
                        {range.label}
                      </span>
                      <span className="text-xs text-gray-600">
                        (
                        {
                          products.filter(
                            (p) => p.price >= range.min && p.price <= range.max,
                          ).length
                        }
                        )
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionSection>

              {/* Product Status Accordion */}
              <AccordionSection
                title="Product Status"
                defaultOpen={false}
                icon={<ChevronDown className="w-4 h-4" />}
              >
                <div className="space-y-2 font-inter">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors flex-1">
                      In Stock
                    </span>
                    <span className="text-xs text-gray-600">
                      ({products.filter((p) => p.inStock).length})
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors flex-1">
                      Pre-order
                    </span>
                    <span className="text-xs text-gray-600">(3)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors flex-1">
                      Coming Soon
                    </span>
                    <span className="text-xs text-gray-600">(5)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-purple-600"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors flex-1">
                      On Sale
                    </span>
                    <span className="text-xs text-gray-600">
                      (
                      {products.filter((p) => p.originalPrice > p.price).length}
                      )
                    </span>
                  </label>
                </div>
              </AccordionSection>

              {/* Rating Filter (Additional) */}
              <AccordionSection
                title="Customer Rating"
                defaultOpen={false}
                icon={<ChevronDown className="w-4 h-4" />}
              >
                <div className="space-y-2 font-inter">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors flex-1 flex items-center gap-1">
                        {[...Array(rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-gray-600" />
                        ))}
                        <span className="ml-1">& Up</span>
                      </span>
                      <span className="text-xs text-gray-600">
                        (
                        {
                          products.filter((p) => Math.floor(p.rating) >= rating)
                            .length
                        }
                        )
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionSection>

              {/* Active Filters */}
              {(selectedCategory !== "All Games" ||
                selectedPriceRange ||
                selectedRating ||
                showInStockOnly ||
                searchQuery) && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h4 className="text-sm font-normal font-inter text-white mb-3">
                    Active Filters
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== "All Games" && (
                      <FilterTag
                        label={selectedCategory}
                        onRemove={() => setSelectedCategory("All Games")}
                      />
                    )}
                    {selectedPriceRange && (
                      <FilterTag
                        label={selectedPriceRange}
                        onRemove={() => setSelectedPriceRange(null)}
                      />
                    )}
                    {selectedRating && (
                      <FilterTag
                        label={`${selectedRating}+ Stars`}
                        onRemove={() => setSelectedRating(null)}
                      />
                    )}
                    {showInStockOnly && (
                      <FilterTag
                        label="In Stock"
                        onRemove={() => setShowInStockOnly(false)}
                      />
                    )}
                    {searchQuery && (
                      <FilterTag
                        label={`"${searchQuery}"`}
                        onRemove={() => setSearchQuery("")}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex flex-col font-inter sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="text-white font-normal font-inter">
                  {filteredProducts.length}
                </span>{" "}
                results
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-[#2A2A2A] text-white rounded-xl text-sm border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer hover:border-purple-500/50 transition-colors"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <NoResults onClearFilters={clearFilters} />
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={() => {
            console.log("Added to cart:", quickViewProduct?.name);
          }}
        />
      )}
    </div>
  );
};

export default AllProducts;
