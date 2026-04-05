"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Heart,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useCart } from "../../app/contexts/CartContext";
import AddToCartButton from "../ui/AddToCartButton";

// Types
interface Product {
  _id: string;
  id: string;
  name: string;
  category: string | { _id: string; name: string };
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

interface Category {
  _id: string;
  name: string;
  slug: string;
}

// Price ranges
const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $500", min: 200, max: 500 },
  { label: "Over $500", min: 500, max: 10000 },
];

// Accordion Section Component
const AccordionSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-white hover:text-purple-400 transition-colors group"
      >
        <span className="font-normal text-sm">{title}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
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

// Optimized Image Component
const OptimizedImage = ({ src, alt }: { src: string; alt: string }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
        <XCircle className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={() => setError(true)}
    />
  );
};

// Product Card Component
const ProductCard = React.memo(
  ({
    product,
    onQuickView,
  }: {
    product: Product;
    onQuickView: (product: Product) => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const finalPrice = product.discountPrice || product.price;
    const originalPrice = product.originalPrice || product.price;
    const categoryName =
      typeof product.category === "object"
        ? product.category.name
        : product.category;

    return (
      <div
        className="group relative bg-[#2A2A2A] rounded-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-800/50 hover:border-purple-500/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product._id}`}>
          <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
            <OptimizedImage
              src={product.image || product.images?.[0] || ""}
              alt={product.name}
            />

            {product.badge && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 text-xs font-normal rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                  {product.badge}
                </span>
              </div>
            )}

            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3 transition-all duration-300 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 transform hover:scale-110 border border-white/20"
              >
                <Eye className="w-5 h-5 text-white" />
              </button>
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-[#1a1a1a]/95 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <XCircle className="w-12 h-12 text-red-500/80 mx-auto mb-2" />
                  <span className="text-white/90 text-sm px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                    Out of Stock
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5">
            <p className="text-xs text-purple-400 mb-1 uppercase tracking-wider">
              {categoryName}
            </p>
            <h3 className="text-lg font-normal text-white mb-3 line-clamp-1 group-hover:text-purple-400 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-xl font-bold text-white">
                ${finalPrice.toFixed(2)}
              </span>
              {originalPrice > finalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <AddToCartButton
              product={{
                _id: product._id,
                name: product.name,
                price: finalPrice,
                inStock: product.inStock,
                image: product.image || product.images?.[0],
              }}
              quantity={1}
              variant="default"
              size="md"
              showIcon={true}
            />
          </div>
        </Link>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";

// Quick View Modal
const QuickViewModal = ({ product, isOpen, onClose }: any) => {
  if (!isOpen || !product) return null;

  const finalPrice = product.discountPrice || product.price;
  const originalPrice = product.originalPrice || product.price;

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
                src={product.image || product.images?.[0] || ""}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">{product.name}</h2>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-purple-400">
                  ${finalPrice.toFixed(2)}
                </span>
                {originalPrice > finalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <AddToCartButton
                product={{
                  _id: product._id,
                  name: product.name,
                  price: finalPrice,
                  inStock: product.inStock,
                  image: product.image || product.images?.[0],
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories`);
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      const selectedCat = categories.find((c) => c.name === selectedCategory);
      if (selectedCat) {
        filtered = filtered.filter((product) => {
          const productCategory =
            typeof product.category === "object"
              ? product.category.name
              : product.category;
          return productCategory === selectedCategory;
        });
      }
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
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
    categories,
  ]);

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
            className="w-full flex items-center justify-between px-4 py-3 bg-[#2A2A2A] rounded-xl text-white border border-gray-800"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${mobileFilterOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:w-64 flex-shrink-0 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-[#2A2A2A] rounded-2xl p-6 sticky top-24 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-purple-400"
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
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Categories */}
              <AccordionSection title="Categories" defaultOpen={true}>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "All"}
                      onChange={() => setSelectedCategory("All")}
                      className="w-4 h-4 accent-purple-600"
                    />
                    <span className="text-sm text-gray-400">All Products</span>
                    <span className="text-xs text-gray-600 ml-auto">
                      ({products.length})
                    </span>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.name}
                        onChange={() => setSelectedCategory(cat.name)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-sm text-gray-400">{cat.name}</span>
                      <span className="text-xs text-gray-600 ml-auto">
                        (
                        {
                          products.filter((p) => {
                            const productCat =
                              typeof p.category === "object"
                                ? p.category.name
                                : p.category;
                            return productCat === cat.name;
                          }).length
                        }
                        )
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionSection>

              {/* Price Range */}
              <AccordionSection title="Price Range" defaultOpen={true}>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === range.label}
                        onChange={() => setSelectedPriceRange(range.label)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-sm text-gray-400">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionSection>

              {/* Stock Status */}
              <AccordionSection title="Availability">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="text-sm text-gray-400">In Stock Only</span>
                </label>
              </AccordionSection>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No products found
                </h3>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
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
