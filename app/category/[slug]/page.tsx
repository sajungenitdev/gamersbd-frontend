// app/category/[slug]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Loader2, Star, ShoppingCart, Eye, Heart } from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import AddToCartButton from "../../../components/ui/AddToCartButton";

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
  name: string;
  price: number;
  discountPrice?: number;
  originalPrice?: number;
  images?: string[];
  mainImage?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  slug?: string;
  finalPrice?: number;
  inStock?: boolean;
  description?: string;
}

const CategoryPage = () => {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [subCategoryProducts, setSubCategoryProducts] = useState<{
    [key: string]: Product[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categorySlug = params.slug as string;

  // Format price (cents to dollars)
  const formatPrice = (price: number) => {
    return price > 100 ? price / 100 : price;
  };

  // Calculate discount percentage
  const getDiscountPercent = (original: number, discounted: number) => {
    if (!original || !discounted || original <= discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  // Get numeric rating
  const getNumericRating = (rating: number | string | undefined): number => {
    if (!rating) return 0;
    if (typeof rating === "number") return rating;
    const match = rating.match(/\d+/);
    return match ? parseInt(match[0]) / 2 : 0;
  };

  // Fetch category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_URL}/api/categories/slug/${categorySlug}`);

        if (res.data.success) {
          const data = res.data.data;
          setCategory(data);
          setSubcategories(data.subcategories || []);
        } else {
          setError("Category not found");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) fetchCategory();
  }, [categorySlug]);

  // Fetch products for all subcategories
  const fetchAllSubCategoryProducts = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const results: { [key: string]: Product[] } = {};

      await Promise.all(
        subcategories.map(async (sub) => {
          try {
            const res = await axios.get(`${API_URL}/api/categories/${sub._id}/products`);
            if (res.data.success) {
              results[sub._id] = res.data.data.map((p: any) => ({
                ...p,
                finalPrice: formatPrice(p.discountPrice || p.price),
                originalPrice: p.originalPrice ? formatPrice(p.originalPrice) : formatPrice(p.price),
                inStock: (p.stock || 0) > 0,
                rating: getNumericRating(p.rating),
              }));
            } else {
              results[sub._id] = [];
            }
          } catch (error) {
            console.error(`Error fetching products for ${sub.name}:`, error);
            results[sub._id] = [];
          }
        })
      );

      setSubCategoryProducts(results);
    } catch (error) {
      console.error("Error fetching subcategory products", error);
    }
  }, [subcategories]);

  useEffect(() => {
    if (subcategories.length > 0) {
      fetchAllSubCategoryProducts();
    }
  }, [subcategories, fetchAllSubCategoryProducts]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error || !category) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The category you are looking for does not exist."}</p>
          <Link href="/shop" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Toaster position="bottom-right" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            <Link href="/" className="text-gray-500 hover:text-purple-400">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link href="/categories" className="text-gray-500 hover:text-purple-400">Categories</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-purple-400 capitalize">{category.name}</span>
          </div>

          {/* Category Info */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 capitalize">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Subcategories and Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {subcategories.map((sub) => {
          const products = subCategoryProducts[sub._id] || [];
          
          return (
            <div key={sub._id} className="mb-12">
              {/* Subcategory Header */}
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-white capitalize">{sub.name}</h2>
                {sub.description && <p className="text-gray-400 text-sm mt-1">{sub.description}</p>}
                <p className="text-xs text-gray-500 mt-1">ID: {sub._id}</p>
              </div>

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="text-center py-12 bg-[#2a2a2a] rounded-xl border border-gray-800">
                  <p className="text-gray-400">No products found in {sub.name}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} onQuickView={setSelectedProduct} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {subcategories.length === 0 && (
          <div className="text-center py-16 bg-[#2a2a2a] rounded-2xl border border-gray-800">
            <p className="text-gray-400">No subcategories found</p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onQuickView }: { product: Product; onQuickView: (product: Product) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const finalPrice = product.finalPrice || product.discountPrice || product.price;
  const originalPrice = product.originalPrice || product.price;
  const discount = getDiscountPercent(originalPrice, finalPrice);
  const rating = product.rating || 0;
  const imageUrl = product.images?.[0] || product.mainImage || "https://via.placeholder.com/300";

  return (
    <div
      className="group relative bg-[#2a2a2a] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              -{discount}%
            </div>
          )}

          {/* Out of Stock Badge */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <span className="px-3 py-1 bg-red-500/90 text-white text-sm rounded-full">Out of Stock</span>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3 transition-all duration-300 ${
              isHovered && product.inStock ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 border border-white/20"
            >
              <Eye className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success("Added to wishlist!");
              }}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/90 transition-all duration-300 border border-white/20"
            >
              <Heart className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-white font-medium mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-purple-400 font-bold text-lg">${finalPrice.toFixed(2)}</span>
            {originalPrice > finalPrice && (
              <span className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="mt-3">
            <AddToCartButton
              product={{
                _id: product._id,
                name: product.name,
                price: finalPrice,
                inStock: product.inStock || false,
                image: imageUrl,
              }}
              quantity={1}
              variant="default"
              size="sm"
              showIcon={true}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

// Quick View Modal Component
const QuickViewModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const finalPrice = product.finalPrice || product.discountPrice || product.price;
  const originalPrice = product.originalPrice || product.price;
  const discount = getDiscountPercent(originalPrice, finalPrice);
  const imageUrl = product.images?.[0] || product.mainImage || "https://via.placeholder.com/300";

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className={`relative bg-[#2A2A2A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800 transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 border border-gray-700"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a1a]">
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
              {discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">{product.name}</h2>
              
              {product.description && (
                <p className="text-gray-400 leading-relaxed">{product.description}</p>
              )}
              
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-purple-400">${finalPrice.toFixed(2)}</span>
                {originalPrice > finalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                    <span className="text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      Save ${(originalPrice - finalPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-green-400 text-sm">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-red-400 text-sm">Out of Stock</span>
                  </>
                )}
              </div>

              <AddToCartButton
                product={{
                  _id: product._id,
                  name: product.name,
                  price: finalPrice,
                  inStock: product.inStock || false,
                  image: imageUrl,
                }}
                quantity={1}
                variant="default"
                size="lg"
                showIcon={true}
                onSuccess={handleClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatPrice = (price: number) => {
  return price > 100 ? price / 100 : price;
};

const getDiscountPercent = (original: number, discounted: number) => {
  if (!original || !discounted || original <= discounted) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

export default CategoryPage;