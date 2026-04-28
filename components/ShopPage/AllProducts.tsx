"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
  Filter,
  Tag,
  DollarSign,
  Package,
  Users,
  Sliders,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Calendar,
  Baby,
} from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import AddToCartButton from "../ui/AddToCartButton";
import { useCart } from "../../app/contexts/CartContext";

// Types
interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  level: number;
  parent?: Category | null;
  subcategories?: Category[];
}

interface Product {
  _id: string;
  id: string;
  createdAt?: string;
  name: string;
  category: string | { _id: string; name: string } | null;
  price: number;
  discountPrice?: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image?: string;
  images?: string[];
  badge?: string;
  inStock: boolean;
  stock?: number;
  slug?: string;
  platform?: string[];
  description?: string;
  ageRange?: {
    min: number;
    max: number;
  };
}

// Modern Accordion Component with single open behavior and clickable chevron
const ModernAccordion = ({
  title,
  children,
  isOpen,
  onToggle,
  count,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  count?: number;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="border-b border-gray-800/50 last:border-0">
      <div className="w-full flex items-center justify-between py-3 text-white hover:text-purple-400 transition-all duration-200 group">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1"
        >
          <span className="text-purple-400">{icon}</span>
          <span className="font-semibold text-sm uppercase tracking-wide">
            {title}
          </span>
          {count !== undefined && (
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </button>
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-purple-600/20 rounded-md transition-colors"
        >
          <div
            className={`transform transition-all duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
          </div>
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Modern Price Range Slider Component
const PriceRangeSlider = ({
  minPrice,
  maxPrice,
  onPriceChange,
}: {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}) => {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const absoluteMin = 0;
  const absoluteMax = 10000;

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(value);
    onPriceChange(value, localMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(value);
    onPriceChange(localMin, value);
  };

  return (
    <div className="space-y-4 mt-5">
      <div className="relative">
        <div className="h-1.5 bg-gray-700 rounded-full">
          <div
            className="absolute h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            style={{
              left: `${(localMin / absoluteMax) * 100}%`,
              right: `${100 - (localMax / absoluteMax) * 100}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={localMin}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-1.5 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500"
        />
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-1.5 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500"
        />
      </div>
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
          <span className="text-xs text-gray-500">Min</span>
          <p className="text-white font-semibold">${localMin}</p>
        </div>
        <span className="text-gray-600">—</span>
        <div className="flex-1 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
          <span className="text-xs text-gray-500">Max</span>
          <p className="text-white font-semibold">${localMax}</p>
        </div>
      </div>
    </div>
  );
};

// Quick Price Chips
const QuickPriceChips = ({
  onSelect,
}: {
  onSelect: (min: number, max: number) => void;
}) => {
  const chips = [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50-100", min: 50, max: 100 },
    { label: "$100-200", min: 100, max: 200 },
    { label: "$200-500", min: 200, max: 500 },
    { label: "$500+", min: 500, max: 10000 },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onSelect(chip.min, chip.max)}
          className="px-3 py-1.5 text-xs rounded-full bg-gray-800/50 text-gray-400 hover:bg-purple-600/20 hover:text-purple-400 transition-all duration-200 border border-gray-700 hover:border-purple-500/50"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};

// Quick Age Chips
const QuickAgeChips = ({
  onSelect,
}: {
  onSelect: (min: number, max: number) => void;
}) => {
  const chips = [
    { label: "0-3 years", min: 0, max: 3 },
    { label: "4-7 years", min: 4, max: 7 },
    { label: "8-12 years", min: 8, max: 12 },
    { label: "13-17 years", min: 13, max: 17 },
    { label: "18+ years", min: 18, max: 100 },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onSelect(chip.min, chip.max)}
          className="px-3 py-1.5 text-xs rounded-full bg-gray-800/50 text-gray-400 hover:bg-orange-600/20 hover:text-orange-400 transition-all duration-200 border border-gray-700 hover:border-orange-500/50"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};

// Age Range Slider Component
const AgeRangeSlider = ({
  minAge,
  maxAge,
  onAgeChange,
}: {
  minAge: number;
  maxAge: number;
  onAgeChange: (min: number, max: number) => void;
}) => {
  const [localMin, setLocalMin] = useState(minAge);
  const [localMax, setLocalMax] = useState(maxAge);
  const absoluteMin = 0;
  const absoluteMax = 100;

  useEffect(() => {
    setLocalMin(minAge);
    setLocalMax(maxAge);
  }, [minAge, maxAge]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(value);
    onAgeChange(value, localMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(value);
    onAgeChange(localMin, value);
  };

  return (
    <div className="space-y-4 mt-5">
      <div className="relative">
        <div className="h-1.5 bg-gray-700 rounded-full">
          <div
            className="absolute h-1.5 bg-gradient-to-r from-orange-500 to-orange-500 rounded-full"
            style={{
              left: `${(localMin / absoluteMax) * 100}%`,
              right: `${100 - (localMax / absoluteMax) * 100}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={localMin}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-1.5 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500"
        />
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-1.5 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500"
        />
      </div>
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
          <span className="text-xs text-gray-500">Min Age</span>
          <p className="text-white font-semibold">{localMin} years</p>
        </div>
        <span className="text-gray-600">—</span>
        <div className="flex-1 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
          <span className="text-xs text-gray-500">Max Age</span>
          <p className="text-white font-semibold">{localMax} years</p>
        </div>
      </div>
    </div>
  );
};

// Modern Category Tree Component with plus/minus icons
const CategoryTree = ({
  categories,
  selectedCategory,
  onCategoryChange,
  getProductCountByCategory,
}: {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryName: string) => void;
  getProductCountByCategory: (categoryName: string) => number;
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const expandParentCategories = (
      categoryList: Category[],
      targetName: string,
    ): boolean => {
      for (const cat of categoryList) {
        if (cat.name === targetName) {
          return true;
        }
        if (cat.subcategories) {
          const found = expandParentCategories(cat.subcategories, targetName);
          if (found) {
            if (!expandedCategories.includes(cat._id)) {
              setExpandedCategories((prev) => [...prev, cat._id]);
            }
            return true;
          }
        }
      }
      return false;
    };

    if (selectedCategory !== "All") {
      expandParentCategories(categories, selectedCategory);
    }
  }, [selectedCategory, categories]);

  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const renderCategoryItem = (category: Category, level: number = 0) => {
    const hasSubcategories =
      category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories.includes(category._id);
    const isSelected = selectedCategory === category.name;
    const paddingLeft = level * 20;

    return (
      <div key={category._id} className="mb-1">
        <div
          className={`flex items-center gap-2 rounded-lg transition-all duration-200 ${
            isSelected
              ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30"
              : "hover:bg-gray-800/50"
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {hasSubcategories && (
            <button
              onClick={(e) => toggleCategory(category._id, e)}
              className="p-1.5 hover:bg-purple-600/20 rounded-md transition-colors flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              )}
            </button>
          )}
          {!hasSubcategories && <div className="w-6" />}

          <input
            type="radio"
            name="category"
            id={`cat-${category._id}`}
            checked={isSelected}
            onChange={() => onCategoryChange(category.name)}
            className="w-4 h-4 accent-purple-600 cursor-pointer flex-shrink-0"
          />

          <label
            htmlFor={`cat-${category._id}`}
            className={`flex-1 py-2 text-sm cursor-pointer transition-colors ${
              isSelected
                ? "text-purple-400 font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {category.name}
          </label>

          <span className="text-xs text-gray-600 bg-gray-900/50 px-2 py-0.5 rounded-full mr-2">
            {getProductCountByCategory(category.name)}
          </span>
        </div>

        {hasSubcategories && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {category.subcategories!.map((sub) =>
              renderCategoryItem(sub, level + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
        <div className="w-6" />
        <input
          type="radio"
          name="category"
          id="cat-all"
          checked={selectedCategory === "All"}
          onChange={() => onCategoryChange("All")}
          className="w-4 h-4 accent-purple-600 cursor-pointer flex-shrink-0"
        />
        <label
          htmlFor="cat-all"
          className={`flex-1 py-2 text-sm cursor-pointer transition-colors ${
            selectedCategory === "All"
              ? "text-purple-400 font-medium"
              : "text-gray-400 hover:text-white"
          }`}
        >
          All Products
        </label>
        <span className="text-xs text-gray-600 bg-gray-900/50 px-2 py-0.5 rounded-full mr-2">
          {getProductCountByCategory("All")}
        </span>
      </div>

      {categories.map((category) => renderCategoryItem(category))}
    </div>
  );
};

// Product Card Component (keep as is - too long, but functional)
const ProductCard = React.memo(
  ({
    product,
    onQuickView,
  }: {
    product: Product;
    onQuickView: (product: Product) => void;
  }) => {
    // ... (keep existing ProductCard implementation)
    const router = useRouter();
    const { addToCart } = useCart();
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    const finalPrice = product.discountPrice || product.price;
    const originalPrice = product.originalPrice || product.price;
    const discount =
      originalPrice > finalPrice
        ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
        : 0;
    const saveAmount =
      originalPrice - finalPrice > 1000
        ? (originalPrice - finalPrice) / 100
        : originalPrice - finalPrice;

    const getCategoryName = (): string => {
      if (!product.category) return "Contemporary";
      if (typeof product.category === "object") {
        return product.category?.name || "Contemporary";
      }
      return product.category || "Contemporary";
    };

    const getImageUrl = (): string => {
      if (product.image) return product.image;
      if (product.images && product.images.length > 0) return product.images[0];
      return "https://via.placeholder.com/300";
    };

    const categoryName = getCategoryName();
    const imageUrl = getImageUrl();

    const displayPrice = finalPrice > 1000 ? finalPrice / 100 : finalPrice;
    const displayOriginalPrice =
      originalPrice > 1000 ? originalPrice / 100 : originalPrice;

    const cartProduct = {
      _id: product._id,
      id: product._id,
      name: product.name || "Product",
      price: finalPrice,
      discountPrice: finalPrice,
      inStock: product.inStock,
      image: imageUrl,
      images: product.images,
      slug: product.slug,
      platform: product.platform?.[0] || "PS5",
    };

    const handleBuyNow = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!product) return;
      setIsBuyingNow(true);

      try {
        const success = await addToCart(cartProduct, 1);
        if (success) {
          router.push("/checkout");
        }
      } catch (error) {
        console.error("Failed to add to cart:", error);
        toast.error("Failed to add to cart");
      } finally {
        setIsBuyingNow(false);
      }
    };

    return (
      <div className="relative group overflow-hidden rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.02]">
        <Link href={`/product/${product._id}`}>
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-800">
            <img
              src={imageUrl}
              alt={product.name || "Product"}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />

            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20 shadow-lg">
                -{discount}%
              </div>
            )}

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                <span className="px-3 py-1 bg-red-500/90 text-white text-sm rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-400 mb-1">{categoryName}</p>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white line-clamp-1">
                {product.name || "Unnamed Product"}
              </h3>

              {product.inStock && (
                <AddToCartButton
                  product={cartProduct}
                  quantity={1}
                  variant="ghost"
                  size="sm"
                  showIcon={true}
                  className="!w-auto !rounded-full hover:bg-gray-800"
                />
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-white font-bold text-lg">
                ${displayPrice.toFixed(2)}
              </span>
              {originalPrice > finalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ${displayOriginalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-green-400 font-medium">
                    Save ${saveAmount.toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {product.inStock ? (
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
              >
                {isBuyingNow ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Buy Now"
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full mt-3 py-2 bg-gray-800 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>
        </Link>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";

// Quick View Modal
const QuickViewModal = ({
  product,
  isOpen,
  onClose,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !product) return null;

  const finalPrice = product.discountPrice || product.price;
  const originalPrice = product.originalPrice || product.price;

  const getImageUrl = (): string => {
    if (product.image) return product.image;
    if (product.images && product.images.length > 0) return product.images[0];
    return "https://via.placeholder.com/300";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-all"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800">
              <img
                src={getImageUrl()}
                alt={product.name || "Product"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">
                {product.name || "Product"}
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-purple-400">
                  ${finalPrice?.toFixed(2) || "0.00"}
                </span>
                {originalPrice && originalPrice > finalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <AddToCartButton
                product={{
                  _id: product._id,
                  name: product.name || "Product",
                  price: finalPrice,
                  inStock: product.inStock || false,
                  image: getImageUrl(),
                }}
                quantity={1}
                variant="default"
                size="lg"
                showIcon={true}
                onSuccess={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Card
const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 animate-pulse">
    <div className="aspect-square bg-gray-700" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-gray-700 rounded" />
      <div className="h-5 w-32 bg-gray-700 rounded" />
      <div className="h-8 w-24 bg-gray-700 rounded" />
      <div className="h-10 w-full bg-gray-700 rounded-xl" />
    </div>
  </div>
);

// Main Component
const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [ageRange, setAgeRange] = useState({ min: 0, max: 100 });
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>("categories");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

  useEffect(() => {
    const fetchCategoryTree = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories/tree`);
        if (response.data.success) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategoryTree();
  }, [API_URL]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/products`);

        if (response.data.success) {
          const fetchedProducts = response.data.data.map((p: any) => ({
            ...p,
            id: p._id,
            inStock: (p.stock || 0) > 0,
            finalPrice: p.discountPrice || p.price,
            category: p.category || null,
            ageRange: p.ageRange || { min: 0, max: 100 },
          }));
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle accordion toggle - only one open at a time
  const handleAccordionToggle = (accordionId: string) => {
    setOpenAccordion((prev) => (prev === accordionId ? "" : accordionId));
  };

  // Handle age range selection from chips
  const handleAgeSelect = (min: number, max: number) => {
    setAgeRange({ min, max });
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => {
        const productCategory = (() => {
          if (!product.category) return null;
          if (typeof product.category === "object")
            return product.category.name;
          return product.category;
        })();
        return productCategory === selectedCategory;
      });
    }

    // Price range filter
    filtered = filtered.filter((product) => {
      const price = product.discountPrice || product.price;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Age range filter
    filtered = filtered.filter((product) => {
      if (!product.ageRange) return true;
      const productMinAge = product.ageRange.min || 0;
      const productMaxAge = product.ageRange.max || 100;
      return productMinAge <= ageRange.max && productMaxAge >= ageRange.min;
    });

    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategory,
    priceRange,
    ageRange,
    showInStockOnly,
    searchQuery,
    sortBy,
  ]);

  const getProductCountByCategory = useCallback(
    (categoryName: string): number => {
      if (categoryName === "All") return products.length;

      const countProductsInCategory = (
        categoryList: Category[],
        targetName: string,
      ): number => {
        let count = 0;
        for (const cat of categoryList) {
          if (cat.name === targetName) {
            count += products.filter((p) => {
              const productCat = (() => {
                if (!p.category) return null;
                if (typeof p.category === "object") return p.category.name;
                return p.category;
              })();
              return productCat === targetName;
            }).length;
          }
          if (cat.subcategories) {
            count += countProductsInCategory(cat.subcategories, targetName);
          }
        }
        return count;
      };

      return countProductsInCategory(categories, categoryName);
    },
    [products, categories],
  );

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange({ min: 0, max: 10000 });
    setAgeRange({ min: 0, max: 100 });
    setShowInStockOnly(false);
    setSearchQuery("");
  };

  const handleQuickPriceSelect = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-700 hover:border-purple-500/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Sorting
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                mobileFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:w-80 flex-shrink-0 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden sticky top-24 border border-gray-700 shadow-xl">
              <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Filters
                    </h3>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear All
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Search */}
                <div className="mb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Categories Accordion */}
                <ModernAccordion
                  title="Categories"
                  isOpen={openAccordion === "categories"}
                  onToggle={() => handleAccordionToggle("categories")}
                  count={getProductCountByCategory(selectedCategory)}
                  icon={<Tag className="w-4 h-4" />}
                >
                  <CategoryTree
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    getProductCountByCategory={getProductCountByCategory}
                  />
                </ModernAccordion>

                {/* Price Range Accordion */}
                <ModernAccordion
                  title="Price Range"
                  isOpen={openAccordion === "price"}
                  onToggle={() => handleAccordionToggle("price")}
                  icon={<DollarSign className="w-4 h-4" />}
                >
                  <div className="space-y-4">
                    <PriceRangeSlider
                      minPrice={priceRange.min}
                      maxPrice={priceRange.max}
                      onPriceChange={(min, max) => setPriceRange({ min, max })}
                    />
                    <QuickPriceChips onSelect={handleQuickPriceSelect} />
                  </div>
                </ModernAccordion>

                {/* Age Range Accordion - NEW */}
                <ModernAccordion
                  title="Age Range"
                  isOpen={openAccordion === "age"}
                  onToggle={() => handleAccordionToggle("age")}
                  icon={<Baby className="w-4 h-4" />}
                >
                  <div className="space-y-4">
                    <AgeRangeSlider
                      minAge={ageRange.min}
                      maxAge={ageRange.max}
                      onAgeChange={(min, max) => setAgeRange({ min, max })}
                    />
                    <QuickAgeChips onSelect={handleAgeSelect} />
                  </div>
                </ModernAccordion>

                {/* Availability Accordion */}
                <ModernAccordion
                  title="Availability"
                  isOpen={openAccordion === "availability"}
                  onToggle={() => handleAccordionToggle("availability")}
                  icon={<Package className="w-4 h-4" />}
                >
                  <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                      className="w-4 h-4 accent-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors flex-1">
                      In Stock Only
                    </span>
                    <span className="text-xs text-gray-600">
                      ({products.filter((p) => p.inStock).length})
                    </span>
                  </label>
                </ModernAccordion>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="text-white font-semibold">
                  {filteredProducts.length}
                </span>{" "}
                of{" "}
                <span className="text-white font-semibold">
                  {products.length}
                </span>{" "}
                products
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm border border-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer hover:border-purple-500/50 transition-colors"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                  <option value="rating">⭐ Top Rated</option>
                  <option value="newest">🆕 Newest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                  <Package className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default AllProducts;