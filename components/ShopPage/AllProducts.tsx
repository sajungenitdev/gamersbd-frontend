"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Heart,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  Tag,
  DollarSign,
  Package,
} from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useCart } from "../../app/contexts/CartContext";
import AddToCartButton from "../ui/AddToCartButton";

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
}

// Price ranges
const priceRanges = [
  { label: "Under $50", min: 0, max: 50, icon: "💰" },
  { label: "$50 - $100", min: 50, max: 100, icon: "💵" },
  { label: "$100 - $200", min: 100, max: 200, icon: "💵" },
  { label: "$200 - $500", min: 200, max: 500, icon: "💸" },
  { label: "Over $500", min: 500, max: 10000, icon: "💎" },
];

// Modern Accordion Component
const ModernAccordion = ({
  title,
  children,
  defaultOpen = true,
  count,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
  icon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-800/50 last:border-0 sidebar-filter">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-white hover:text-purple-400 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-500">{icon}</span>}
          <span className="font-semibold text-sm uppercase tracking-wide">
            {title}
          </span>
          {count !== undefined && (
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <div
          className={`transform transition-all duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-full opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Modern Category Tree Component
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

  // Auto-expand parent categories when a subcategory is selected
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

  const toggleCategory = (categoryId: string) => {
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
              ? "bg-purple-600/10 border border-purple-500/30"
              : "hover:bg-gray-800/50"
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasSubcategories && (
            <button
              onClick={() => toggleCategory(category._id)}
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

          {/* Radio Button */}
          <input
            type="radio"
            name="category"
            id={`cat-${category._id}`}
            checked={isSelected}
            onChange={() => onCategoryChange(category.name)}
            className="w-4 h-4 accent-purple-600 cursor-pointer flex-shrink-0"
          />

          {/* Category Label */}
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

          {/* Product Count */}
          <span className="text-xs text-gray-600 bg-gray-900/50 px-2 py-0.5 rounded-full mr-2">
            {getProductCountByCategory(category.name)}
          </span>
        </div>

        {/* Render Subcategories */}
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
      {/* All Products Option */}
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

      {/* Render Categories */}
      {categories.map((category) => renderCategoryItem(category))}
    </div>
  );
};

// Product Card Component - Simplified version
const ProductCard = React.memo(
  ({
    product,
    onQuickView,
  }: {
    product: Product;
    onQuickView: (product: Product) => void;
  }) => {
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

    // Prepare product data for AddToCartButton
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

    const handleBuyNow = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Add to cart and redirect
      window.location.href = `/checkout?product=${product._id}`;
    };

    return (
      <div className="relative group overflow-hidden rounded-2xl transition-all duration-300">
        <p>{`/product/${product._id}`}</p>
        <Link href={`/product/${product._id}`}>
          {/* Image Container */}
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-800 dark:bg-gray-200">
            <img
              src={imageUrl}
              alt={product.name || "Product"}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 opacity-100"
              loading="lazy"
            />

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                -{discount}%
              </div>
            )}

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 rounded-2xl">
                <span className="px-3 py-1 bg-red-500/90 text-white text-sm rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category Name */}
            <p className="text-sm text-gray-400 dark:text-gray-600 mb-1">
              {categoryName}
            </p>

            {/* Product Name & Cart Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white dark:text-black line-clamp-1">
                {product.name || "Unnamed Product"}
              </h3>

              {/* Add to Cart Button - Using your component */}
              {product.inStock && (
                <AddToCartButton
                  product={cartProduct}
                  quantity={1}
                  variant="ghost"
                  size="sm"
                  showIcon={true}
                  className="!w-auto !p-1.5 !rounded-full hover:bg-gray-800 dark:hover:bg-gray-200"
                />
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white dark:text-black font-normal text-lg">
                ${displayPrice.toFixed(2)}
              </span>
              {originalPrice > finalPrice && (
                <>
                  <span className="text-sm text-gray-400 dark:text-gray-600 line-through">
                    ${displayOriginalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#d88616] dark:text-green-600 font-medium">
                    Save ${saveAmount.toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Buy Now Button */}
            {product.inStock ? (
              <button
                onClick={handleBuyNow}
                className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                Buy Now
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
        <div className="relative bg-[#2A2A2A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-purple-600 transition-all"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a1a]">
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
                  <span className=" text-gray-500 line-through">
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

// Main Component
const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null,
  );
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

  // Fetch categories tree
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

  // Fetch products
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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
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

    // Price filter
    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter((product) => {
          const price = product.discountPrice || product.price;
          return price >= range.min && price <= range.max;
        });
      }
    }

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sorting
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
    }

    return filtered;
  }, [
    products,
    selectedCategory,
    selectedPriceRange,
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
    setSelectedPriceRange(null);
    setShowInStockOnly(false);
    setSearchQuery("");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#2A2A2A] rounded-xl text-white border border-gray-800 hover:border-purple-500/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Sorting
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${mobileFilterOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:w-72 flex-shrink-0 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden sticky top-24 border border-gray-800">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Filters
                    </h3>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 pt-0">
                {/* Search */}
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Categories */}
                <ModernAccordion
                  title="Categories"
                  defaultOpen={true}
                  icon={<Tag className="w-4 h-4" />}
                >
                  <CategoryTree
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    getProductCountByCategory={getProductCountByCategory}
                  />
                </ModernAccordion>

                {/* Price Range */}
                <ModernAccordion
                  title="Price Range"
                  defaultOpen={true}
                  icon={<DollarSign className="w-4 h-4" />}
                >
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={range.label}
                        className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="price"
                          checked={selectedPriceRange === range.label}
                          onChange={() => setSelectedPriceRange(range.label)}
                          className="w-4 h-4 accent-purple-600"
                        />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors flex-1">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </ModernAccordion>

                {/* Availability */}
                <ModernAccordion
                  title="Availability"
                  icon={<Package className="w-4 h-4" />}
                >
                  <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
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
            {/* Sort Bar */}
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
                  className="px-4 py-2 bg-[#2A2A2A] text-white rounded-xl text-sm border border-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer hover:border-purple-500/50 transition-colors"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                  <option value="rating">⭐ Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#2A2A2A] rounded-2xl border border-gray-800">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <Package className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20"
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
