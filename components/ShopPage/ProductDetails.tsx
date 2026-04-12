// app/product/[id]/page.tsx
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useCart } from "../../app/contexts/CartContext";
import { useWishlist } from "../../app/contexts/WishlistContext";
import { useUserAuth } from "../../app/contexts/UserAuthContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string | { _id: string; name: string; slug?: string };
  stock: number;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  platform?: string[];
  tags?: string[];
  slug?: string;
  brand?: string;
  sku?: string;
}

interface Review {
  _id: string;
  user: { 
    _id: string;
    name: string; 
    avatar?: string;
  };
  rating: number;
  title?: string;  // Added title
  comment: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  helpful?: {  // Added helpful property
    count: number;
    users: string[];
  };
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart, isAddingProduct } = useCart();
  const { 
    wishlist, 
    addToWishlist, 
    removeFromWishlist, 
    checkInWishlist, 
    refreshWishlist,
    isLoading: wishlistLoading 
  } = useWishlist();
  const { user } = useUserAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);

  const productId = params?.id as string;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

  // Memoized values
  const finalPrice = useMemo(() => product?.discountPrice || product?.price || 0, [product]);
  const originalPrice = useMemo(() => product?.price || 0, [product]);
  const discount = useMemo(() => {
    if (product?.discountPrice && product.price > product.discountPrice) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  }, [product]);

  const categoryName = useMemo(() => {
    if (!product?.category) return "Product";
    if (typeof product.category === "object") {
      return product.category.name || "Product";
    }
    return product.category || "Product";
  }, [product]);

  const categorySlug = useMemo(() => {
    if (!product?.category) return "";
    if (typeof product.category === "object") {
      return product.category.slug || "";
    }
    return "";
  }, [product]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setImageLoaded(false);

        const response = await axios.get(`${API_URL}/api/products/${productId}`);

        if (response.data.success) {
          const productData = response.data.data;
          setProduct({
            ...productData,
            inStock: (productData.stock || 0) > 0,
          });
          setSelectedImage(0);
          setQuantity(1);

          // Update page title
          document.title = `${productData.name} | GamersBD`;
        } else {
          toast.error("Product not found");
          router.push("/shop");
        }
      } catch (error: any) {
        console.error("Failed to fetch product:", error);
        toast.error(error.response?.data?.message || "Failed to load product");
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
      if (!product?._id) return;

      try {
        let categoryId = "";
        if (typeof product.category === "object") {
          categoryId = product.category._id;
        } else {
          categoryId = product.category;
        }

        if (categoryId) {
          const response = await axios.get(`${API_URL}/api/products`, {
            params: {
              category: categoryId,
              limit: 5,
              exclude: product._id,
            },
          });

          if (response.data.success) {
            const related = response.data.data.filter(
              (p: Product) => p._id !== product._id
            );
            setRelatedProducts(related.slice(0, 4));
            return;
          }
        }

        const fallbackResponse = await axios.get(`${API_URL}/api/products`, {
          params: { limit: 4, exclude: product._id },
        });

        if (fallbackResponse.data.success) {
          setRelatedProducts(fallbackResponse.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
        setRelatedProducts([]);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product, API_URL]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id) return;

      try {
        const response = await axios.get(`${API_URL}/api/reviews/product/${product._id}`);
        if (response.data.success) {
          setReviews(response.data.data);
        } else {
          setReviews([]);
        }
      } catch (error: any) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      }
    };

    if (product && activeTab === "reviews") {
      fetchReviews();
    }
  }, [product, API_URL, activeTab]);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !product?._id) return;
      
      try {
        // Refresh wishlist to get latest data
        await refreshWishlist();
      } catch (error) {
        console.error("Failed to refresh wishlist:", error);
      }
    };

    if (product && user) {
      checkWishlistStatus();
    }
  }, [product, user, refreshWishlist]);

  // Update wishlist status when wishlist changes
  useEffect(() => {
    if (!product?._id || !wishlist) {
      setIsWishlisted(false);
      setWishlistItemId(null);
      return;
    }

    const item = wishlist.items?.find((item: any) => item.product._id === product._id);
    setIsWishlisted(!!item);
    setWishlistItemId(item?._id || null);
  }, [wishlist, product]);

  const increaseQuantity = useCallback(() => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Only ${product?.stock} items available`);
    }
  }, [product, quantity]);

  const decreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }, [quantity]);

  const handleAddToWishlist = async () => {
    if (!product) return;
    
    if (!user) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isWishlisted && wishlistItemId) {
        const success = await removeFromWishlist(wishlistItemId);
        if (success) {
          setIsWishlisted(false);
          setWishlistItemId(null);
          toast.success("Removed from wishlist");
        }
      } else {
        const success = await addToWishlist(product._id);
        if (success) {
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      }
    } catch (error: any) {
      console.error("Failed to update wishlist:", error);
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} on GamersBD!`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to share:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    const cartProduct = {
      _id: product._id,
      name: product.name,
      price: finalPrice,
      inStock: product.inStock,
      image: product.images?.[0],
    };

    const success = await addToCart(cartProduct, quantity);
    if (success) {
      router.push("/checkout");
    }
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-600"
              }`}
          />
        ))}
      </div>
    );
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
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
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

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : product.rating || 0;

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-purple-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-purple-400 transition-colors">
            Shop
          </Link>
          {categoryName !== "Product" && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/category/${categorySlug || categoryName.toLowerCase()}`}
                className="hover:text-purple-400 transition-colors"
              >
                {categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-white truncate">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#2A2A2A] border border-gray-800">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              )}
              <img
                src={product.images?.[selectedImage] || "/placeholder.png"}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                onLoad={() => setImageLoaded(true)}
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageLoaded(false);
                    }}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === index
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
            <Link
              href={`/category/${categorySlug || categoryName.toLowerCase()}`}
              className="text-sm text-purple-400 font-medium hover:underline inline-block"
            >
              {categoryName}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-sm text-gray-400">
                  ({reviews.length || product.reviews || 0} reviews)
                </span>
              </div>
              {product.sku && (
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              )}
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
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                    Save ${(originalPrice - finalPrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-medium">Quantity:</span>
                <div className="flex items-center gap-3 bg-[#2A2A2A] rounded-lg border border-gray-700">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-800 rounded-l-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-800 rounded-r-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Max {product.stock} items
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  const cartProduct = {
                    _id: product._id,
                    name: product.name,
                    price: finalPrice,
                    inStock: product.inStock,
                    image: product.images?.[0],
                  };
                  addToCart(cartProduct, quantity);
                }}
                disabled={!product.inStock || isAddingProduct(product._id)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingProduct(product._id) ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Secondary Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist || wishlistLoading}
                className="flex-1 px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-gray-400 hover:text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAddingToWishlist ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                )}
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>

              <button
                onClick={handleShare}
                disabled={isSharing}
                className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-gray-400 hover:text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                Share
              </button>
            </div>

            {/* Delivery Info */}
            <div className="pt-6 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <Truck className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">2 Year Warranty</p>
                    <p className="text-xs text-gray-500">Manufacturer warranty</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <RefreshCw className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">30 Day Returns</p>
                    <p className="text-xs text-gray-500">Easy returns policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Check className="w-5 h-5 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Secure Checkout</p>
                    <p className="text-xs text-gray-500">100% secure payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex gap-6 border-b border-gray-800 mb-6 overflow-x-auto">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-lg font-medium capitalize transition-colors whitespace-nowrap ${activeTab === tab
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                {tab} {tab === "reviews" && `(${reviews.length || product.reviews || 0})`}
              </button>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {product.description || "No description available for this product."}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-4 py-3 border-b border-gray-800">
                  <span className="sm:w-32 text-gray-400 font-medium">Platform:</span>
                  <span className="text-white">
                    {product.platform?.length ? product.platform.join(", ") : "All Platforms"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 py-3 border-b border-gray-800">
                  <span className="sm:w-32 text-gray-400 font-medium">Category:</span>
                  <span className="text-white">{categoryName}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 py-3 border-b border-gray-800">
                  <span className="sm:w-32 text-gray-400 font-medium">Stock Status:</span>
                  <span className={product.inStock ? "text-green-500" : "text-red-500"}>
                    {product.inStock ? `${product.stock} units available` : "Out of Stock"}
                  </span>
                </div>
                {product.brand && (
                  <div className="flex flex-col sm:flex-row gap-4 py-3 border-b border-gray-800">
                    <span className="sm:w-32 text-gray-400 font-medium">Brand:</span>
                    <span className="text-white">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex flex-col sm:flex-row gap-4 py-3">
                    <span className="sm:w-32 text-gray-400 font-medium">SKU:</span>
                    <span className="text-white">{product.sku}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {isLoadingReviews ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 bg-[#2A2A2A] rounded-xl">
                    <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No reviews yet.</p>
                    <Link
                      href={`/product/${product._id}/review`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                    >
                      Be the first to review
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-[#2A2A2A] rounded-xl">
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {averageRating.toFixed(1)}
                        </div>
                        {renderStars(averageRating)}
                        <p className="text-sm text-gray-400 mt-1">
                          Based on {reviews.length} reviews
                        </p>
                      </div>
                      <Link
                        href={`/product/${product._id}/review`}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                      >
                        Write a Review
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review._id} className="p-4 bg-[#2A2A2A] rounded-xl">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {review.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{review.user.name}</p>
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {review.title && (
                            <h4 className="text-white font-semibold mt-2">{review.title}</h4>
                          )}
                          <p className="text-gray-300 mt-2">{review.comment}</p>
                          {review.helpful && (
                            <div className="flex items-center gap-2 mt-3">
                              <button className="text-xs text-gray-500 hover:text-purple-400 transition">
                                Helpful ({review.helpful.count})
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">You May Also Like</h2>
              <Link
                href={`/category/${categorySlug || categoryName.toLowerCase()}`}
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((related) => {
                const relatedFinalPrice = related.discountPrice || related.price;
                const relatedDiscount = related.discountPrice
                  ? Math.round(((related.price - related.discountPrice) / related.price) * 100)
                  : 0;

                return (
                  <Link
                    key={related._id}
                    href={`/product/${related._id}`}
                    className="group bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#1f1f1f]">
                      <img
                        src={related.images?.[0] || "/placeholder.png"}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {relatedDiscount > 0 && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                          -{relatedDiscount}%
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="text-white font-medium text-sm md:text-base line-clamp-1">
                        {related.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-purple-400 font-semibold text-sm md:text-base">
                          ${relatedFinalPrice.toFixed(2)}
                        </span>
                        {relatedDiscount > 0 && (
                          <span className="text-gray-500 text-xs line-through">
                            ${related.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;