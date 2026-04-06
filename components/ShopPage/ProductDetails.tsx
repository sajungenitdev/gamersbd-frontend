// app/product/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  Minus,
  Plus,
  Check,
  Loader2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import AddToCartButton from "../ui/AddToCartButton";
import { useCart } from "../../app/contexts/CartContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string | { _id: string; name: string };
  stock: number;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  platform?: string[];
  tags?: string[];
  slug?: string;
}

const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart, isAddingProduct } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const productId = params?.id as string;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        
        if (response.data.success) {
          const productData = response.data.data;
          setProduct({
            ...productData,
            inStock: (productData.stock || 0) > 0,
          });
          setSelectedImage(0);
        } else {
          toast.error("Product not found");
          router.push("/shop");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, API_URL, router]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.category) return;
      
      try {
        const categoryName = typeof product.category === "object" 
          ? product.category.name 
          : product.category;
        
        const response = await axios.get(`${API_URL}/api/products?category=${categoryName}&limit=4`);
        
        if (response.data.success) {
          const related = response.data.data.filter(
            (p: Product) => p._id !== product._id
          );
          setRelatedProducts(related.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product, API_URL]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const getFinalPrice = () => {
    return product?.discountPrice || product?.price || 0;
  };

  const getOriginalPrice = () => {
    return product?.price || 0;
  };

  const getDiscountPercentage = () => {
    if (product?.discountPrice && product.price > product.discountPrice) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const getCategoryName = (): string => {
    if (!product?.category) return "Product";
    if (typeof product.category === "object") {
      return product.category.name || "Product";
    }
    return product.category || "Product";
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    const cartProduct = {
      _id: product._id,
      name: product.name,
      price: getFinalPrice(),
      inStock: product.inStock,
      image: product.images?.[0],
    };
    
    const success = await addToCart(cartProduct, quantity);
    if (success) {
      router.push("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = getFinalPrice();
  const originalPrice = getOriginalPrice();
  const discount = getDiscountPercentage();
  const categoryName = getCategoryName();

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Toaster position="bottom-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#2A2A2A] border border-gray-800">
              <img
                src={product.images?.[selectedImage] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-purple-500"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Category */}
            <p className="text-sm text-purple-400 font-medium">{categoryName}</p>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (product.rating || 0)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-purple-400">
                ${finalPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">In Stock ({product.stock} available)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Quantity:</span>
                <div className="flex items-center gap-3 bg-[#2A2A2A] rounded-lg border border-gray-700">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-800 rounded-l-lg transition disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-800 rounded-r-lg transition disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AddToCartButton
                product={{
                  _id: product._id,
                  name: product.name,
                  price: finalPrice,
                  inStock: product.inStock,
                  image: product.images?.[0],
                }}
                quantity={quantity}
                variant="default"
                size="lg"
                showIcon={true}
                className="flex-1"
              />
              
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <Truck className="w-5 h-5" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-sm">30 Day Returns</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Add to Wishlist</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex gap-6 border-b border-gray-800 mb-6">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-lg font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            {activeTab === "description" && (
              <p className="text-gray-300 leading-relaxed">
                {product.description || "No description available."}
              </p>
            )}
            {activeTab === "specifications" && (
              <div className="space-y-2">
                <div className="flex gap-4 py-2 border-b border-gray-800">
                  <span className="w-32 text-gray-400">Platform:</span>
                  <span className="text-white">{product.platform?.join(", ") || "All Platforms"}</span>
                </div>
                <div className="flex gap-4 py-2 border-b border-gray-800">
                  <span className="w-32 text-gray-400">Category:</span>
                  <span className="text-white">{categoryName}</span>
                </div>
                <div className="flex gap-4 py-2 border-b border-gray-800">
                  <span className="w-32 text-gray-400">Stock:</span>
                  <span className="text-white">{product.stock} units</span>
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex gap-4 py-2">
                    <span className="w-32 text-gray-400">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-8">
                <p className="text-gray-400">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  href={`/product/${related._id}`}
                  className="group bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={related.images?.[0] || "/placeholder.png"}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium line-clamp-1">
                      {related.name}
                    </h3>
                    <p className="text-purple-400 font-semibold mt-1">
                      ${(related.discountPrice || related.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;