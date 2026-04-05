// app/product/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Shield,
  Truck,
  RefreshCw,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Share2,
  AlertCircle,
  Maximize2,
  Minimize2,
  ThumbsUp,
  MessageCircle,
  Flame,
  Zap,
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import AddToCartButton from "../ui/AddToCartButton";

// Types based on your API response
interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  finalPrice: number;
  currency: string;
  category: {
    _id: string;
    name: string;
  };
  mainImage: string;
  images: string[];
  stock: number;
  availability: string;
  type: string;
  platform: string[];
  genre: string[];
  brand: string;
  publisher: string;
  releaseDate: string;
  features: string[];
  specifications: Record<string, any>;
  weight: number;
  offerType: string | null;
  offerBadge: string | null;
  offerBadgeColor: string | null;
  isOnSale: boolean;
  discountPercentage: number;
  isDealActive: boolean;
  sku: string;
  rating: string;
  storageRequired: string;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[]; // Added as optional since it appears in your data
  views: number;
  soldCount: number;
  inStock: boolean;
  ageRange?: { min: number; max: number };
  players?: { min: number; max: number };
  dimensions?: { length: number; width: number; height: number; unit: string };
}

// Image Gallery Component - Fixed: removed product reference
const ImageGallery = ({
  images,
  mainImage,
  offerBadge,
  offerBadgeColor,
  isDealActive,
}: {
  images: string[];
  mainImage: string;
  offerBadge?: string | null;
  offerBadgeColor?: string | null;
  isDealActive?: boolean;
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const allImages =
    images && images.length > 0 ? images : mainImage ? [mainImage] : [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  if (
    !allImages ||
    allImages.length === 0 ||
    (allImages.length === 1 && !allImages[0])
  ) {
    return (
      <div className="rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800 h-[500px] flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-[#1a1a1a] p-8" : ""}`}
    >
      {/* Main Image */}
      <div className="relative group">
        <div
          className={`relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800 ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          style={{
            height: isFullscreen ? "calc(100vh - 200px)" : "500px",
          }}
        >
          <img
            src={allImages[currentImage]}
            alt="Product"
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : {}
            }
          />

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage((prev) =>
                    prev === 0 ? allImages.length - 1 : prev - 1,
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage((prev) =>
                    prev === allImages.length - 1 ? 0 : prev + 1,
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(!isFullscreen);
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Offer Badge */}
          {isDealActive && offerBadge && (
            <div className="absolute top-4 left-4 z-10">
              <span
                className={`px-3 py-1 text-xs font-normal rounded-full bg-gradient-to-r ${
                  offerBadgeColor === "red"
                    ? "from-red-600 to-red-500"
                    : offerBadgeColor === "green"
                      ? "from-green-600 to-green-500"
                      : offerBadgeColor === "yellow"
                        ? "from-yellow-600 to-yellow-500"
                        : "from-purple-600 to-purple-500"
                } text-white shadow-lg shadow-black/20 flex items-center gap-1`}
              >
                {offerBadge === "Hot" && <Flame className="w-3 h-3" />}
                {offerBadge === "New" && <Zap className="w-3 h-3" />}
                {offerBadge}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === index
                  ? "border-purple-500 opacity-100"
                  : "border-transparent opacity-50 hover:opacity-75"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Product Info Component
const ProductInfo = ({
  product,
  onQuantityChange,
}: {
  product: Product;
  onQuantityChange?: (quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(
    product.platform?.[0] || "",
  );

  const finalPrice = product.finalPrice || product.price;
  const originalPrice = product.price;
  const discount =
    originalPrice > finalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : product.discountPercentage;

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add to wishlist");
        return;
      }

      if (isWishlisted) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${product._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
          {
            productId: product._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("Added to wishlist");
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const inStock = product.stock > 0 && product.availability !== "pre-order";

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          {product.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-400">
                {product.rating}
              </span>
            </div>
          )}
          {inStock ? (
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              In Stock ({product.stock} available)
            </span>
          ) : product.availability === "pre-order" ? (
            <span className="flex items-center gap-1 text-blue-400 text-sm">
              <Zap className="w-4 h-4" />
              Pre-order Available
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-white">
          {product.currency === "USD" ? "$" : product.currency}{" "}
          {finalPrice.toFixed(2)}
        </span>
        {originalPrice > finalPrice && (
          <>
            <span className="text-xl text-gray-500 line-through">
              {product.currency === "USD" ? "$" : product.currency}{" "}
              {originalPrice.toFixed(2)}
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-gray-300 leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Platform Selection */}
      {product.platform && product.platform.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Platform</h3>
          <div className="flex flex-wrap gap-2">
            {product.platform.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedPlatform === platform
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-purple-500"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Quantity</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-[#1a1a1a] rounded-lg border border-gray-800 flex items-center justify-center hover:border-purple-500 transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-400" />
          </button>
          <span className="w-16 text-center text-white font-medium">
            {quantity}
          </span>
          <button
            onClick={() =>
              handleQuantityChange(Math.min(product.stock || 999, quantity + 1))
            }
            className="w-10 h-10 bg-[#1a1a1a] rounded-lg border border-gray-800 flex items-center justify-center hover:border-purple-500 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          {product.stock && (
            <span className="text-sm text-gray-500 ml-2">
              {product.stock} available
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <AddToCartButton
          product={{
            _id: product._id,
            name: product.name,
            price: finalPrice,
            inStock: inStock,
            images: product.images,
            image: product.mainImage,
            platform: selectedPlatform,
          }}
          quantity={quantity}
          variant="default"
          size="lg"
          showIcon={true}
        />
        <button
          onClick={handleAddToWishlist}
          className="w-14 h-14 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-purple-500 transition-all group"
        >
          <Heart
            className={`w-6 h-6 mx-auto transition-all ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400 group-hover:text-red-400"
            }`}
          />
        </button>
        <button
          onClick={handleShare}
          className="w-14 h-14 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-purple-500 transition-all group"
        >
          <Share2 className="w-6 h-6 text-gray-400 mx-auto group-hover:text-purple-400" />
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-gray-400">
          <Truck className="w-4 h-4 text-purple-400" />
          <span className="text-sm">Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <RefreshCw className="w-4 h-4 text-purple-400" />
          <span className="text-sm">30-Day Returns</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="text-sm">Secure Payment</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <CheckCircle className="w-4 h-4 text-purple-400" />
          <span className="text-sm">Official Product</span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="space-y-2 text-sm border-t border-gray-800 pt-4">
        {product.sku && (
          <div className="flex">
            <span className="w-24 text-gray-500">SKU:</span>
            <span className="text-gray-300">{product.sku}</span>
          </div>
        )}
        {product.category && (
          <div className="flex">
            <span className="w-24 text-gray-500">Category:</span>
            <span className="text-gray-300">{product.category.name}</span>
          </div>
        )}
        {product.publisher && (
          <div className="flex">
            <span className="w-24 text-gray-500">Publisher:</span>
            <span className="text-gray-300">{product.publisher}</span>
          </div>
        )}
        {product.releaseDate && (
          <div className="flex">
            <span className="w-24 text-gray-500">Release:</span>
            <span className="text-gray-300">
              {new Date(product.releaseDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {product.tags && product.tags.length > 0 && (
          <div className="flex">
            <span className="w-24 text-gray-500">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#1a1a1a] text-gray-400 text-xs rounded-full border border-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Tab Component
const Tab = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium transition-all relative ${
      isActive ? "text-purple-400" : "text-gray-400 hover:text-gray-300"
    }`}
  >
    {label}
    {isActive && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
    )}
  </button>
);

// Description Tab
const DescriptionTab = ({ product }: { product: Product }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">About This Game</h3>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {product.description || "No description available."}
      </p>
    </div>

    {product.features &&
      product.features.length > 0 &&
      product.features[0] !== "Mollitia sit ullamc" && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Key Features
          </h3>
          <ul className="grid md:grid-cols-2 gap-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

    {product.genre && product.genre.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {product.genre.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 bg-[#1a1a1a] text-gray-300 rounded-lg border border-gray-800"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    )}

    {product.storageRequired && (
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">
          Storage Required
        </h3>
        <p className="text-gray-300">{product.storageRequired}</p>
      </div>
    )}
  </div>
);

// Specifications Tab
const SpecificationsTab = ({ product }: { product: Product }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-medium mb-3">Product Information</h4>
        <div className="space-y-2 text-sm">
          {product.type && (
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="text-gray-300 capitalize">{product.type}</span>
            </div>
          )}
          {product.sku && (
            <div className="flex justify-between">
              <span className="text-gray-500">SKU</span>
              <span className="text-gray-300">{product.sku}</span>
            </div>
          )}
          {product.weight && (
            <div className="flex justify-between">
              <span className="text-gray-500">Weight</span>
              <span className="text-gray-300">{product.weight} g</span>
            </div>
          )}
          {product.views !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Views</span>
              <span className="text-gray-300">
                {product.views.toLocaleString()}
              </span>
            </div>
          )}
          {product.soldCount !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Sold</span>
              <span className="text-gray-300">
                {product.soldCount.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-medium mb-3">Additional Details</h4>
        <div className="space-y-2 text-sm">
          {product.platform && product.platform.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Platforms</span>
              <span className="text-gray-300">
                {product.platform.join(", ")}
              </span>
            </div>
          )}
          {product.availability && (
            <div className="flex justify-between">
              <span className="text-gray-500">Availability</span>
              <span className="text-gray-300 capitalize">
                {product.availability}
              </span>
            </div>
          )}
          {product.isDealActive && (
            <div className="flex justify-between">
              <span className="text-gray-500">Deal</span>
              <span className="text-green-400">Active</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Age Range and Players if available */}
    {(product.ageRange || product.players) && (
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-medium mb-3">Game Details</h4>
        <div className="space-y-2 text-sm">
          {product.ageRange && (
            <div className="flex justify-between">
              <span className="text-gray-500">Age Range</span>
              <span className="text-gray-300">
                {product.ageRange.min} - {product.ageRange.max} years
              </span>
            </div>
          )}
          {product.players && (
            <div className="flex justify-between">
              <span className="text-gray-500">Players</span>
              <span className="text-gray-300">
                {product.players.min} - {product.players.max}
              </span>
            </div>
          )}
          {product.dimensions && (
            <div className="flex justify-between">
              <span className="text-gray-500">Dimensions</span>
              <span className="text-gray-300">
                {product.dimensions.length} x {product.dimensions.width} x{" "}
                {product.dimensions.height} {product.dimensions.unit}
              </span>
            </div>
          )}
        </div>
      </div>
    )}

    {/* SEO Info */}
    {(product.metaTitle || product.metaDescription) && (
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-medium mb-3">SEO Information</h4>
        <div className="space-y-2 text-sm">
          {product.metaTitle && (
            <div>
              <span className="text-gray-500 block mb-1">Meta Title</span>
              <span className="text-gray-300">{product.metaTitle}</span>
            </div>
          )}
          {product.metaDescription && (
            <div>
              <span className="text-gray-500 block mb-1">Meta Description</span>
              <span className="text-gray-300">{product.metaDescription}</span>
            </div>
          )}
          {product.metaKeywords && product.metaKeywords.length > 0 && (
            <div>
              <span className="text-gray-500 block mb-1">Meta Keywords</span>
              <div className="flex flex-wrap gap-1">
                {product.metaKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-0.5 bg-[#2a2a2a] text-gray-400 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#1a1a1a]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="animate-pulse">
          <div className="bg-[#2a2a2a] rounded-2xl h-[500px]"></div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-[#2a2a2a] rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-[#2a2a2a] rounded w-1/2 animate-pulse"></div>
          <div className="h-12 bg-[#2a2a2a] rounded w-1/3 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[#2a2a2a] rounded w-full animate-pulse"></div>
            <div className="h-4 bg-[#2a2a2a] rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-[#2a2a2a] rounded w-4/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error Component
const ErrorDisplay = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
    <div className="text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">
        Error Loading Product
      </h2>
      <p className="text-gray-400 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Main Component
const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const productId = params.id as string;

  // Fetch product data
  // Update the fetch URL to use the new endpoint
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use your existing API endpoint
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${productId}`,
      );

      if (response.data.success) {
        const productData = response.data.data;
        setProduct({
          ...productData,
          inStock: (productData.stock || 0) > 0,
          images:
            productData.images ||
            (productData.mainImage ? [productData.mainImage] : []),
        });
      } else {
        setError("Product not found");
      }
    } catch (error: any) {
      console.error("Failed to fetch product:", error);
      setError(error.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Handle scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setIsStickyBarVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !product) {
    return (
      <ErrorDisplay
        message={error || "Product not found"}
        onRetry={fetchProduct}
      />
    );
  }

  const finalPrice = product.finalPrice || product.price;
  const inStock = product.stock > 0 && product.availability !== "pre-order";

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#2A2A2A",
            color: "#fff",
            border: "1px solid #3f3f46",
            borderRadius: "12px",
          },
        }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <a
            href="/"
            className="text-gray-500 hover:text-purple-400 transition-colors"
          >
            Home
          </a>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <a
            href="/shop"
            className="text-gray-500 hover:text-purple-400 transition-colors"
          >
            Shop
          </a>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {product.category && (
            <>
              <a
                href={`/category/${product.category.name.toLowerCase()}`}
                className="text-gray-500 hover:text-purple-400 transition-colors"
              >
                {product.category.name}
              </a>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </>
          )}
          <span className="text-purple-400 line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Gallery */}
          <ImageGallery
            images={product.images || []}
            mainImage={product.mainImage}
            offerBadge={product.offerBadge}
            offerBadgeColor={product.offerBadgeColor}
            isDealActive={product.isDealActive}
          />

          {/* Right Column - Info */}
          <ProductInfo product={product} onQuantityChange={setQuantity} />
        </div>

        {/* Tabs */}
        <div className="mt-12 border-b border-gray-800">
          <div className="flex overflow-x-auto">
            <Tab
              label="Description"
              isActive={activeTab === "description"}
              onClick={() => setActiveTab("description")}
            />
            <Tab
              label="Specifications"
              isActive={activeTab === "specifications"}
              onClick={() => setActiveTab("specifications")}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "description" && <DescriptionTab product={product} />}
          {activeTab === "specifications" && (
            <SpecificationsTab product={product} />
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedFinalPrice =
                  relatedProduct.finalPrice || relatedProduct.price;
                return (
                  <a
                    key={relatedProduct._id}
                    href={`/product/${relatedProduct._id}`}
                    className="group bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={
                          relatedProduct.mainImage || relatedProduct.images?.[0]
                        }
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-medium mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
                        {relatedProduct.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 font-bold">
                          ${relatedFinalPrice.toFixed(2)}
                        </span>
                        {relatedProduct.soldCount !== undefined && (
                          <span className="text-xs text-gray-500">
                            Sold: {relatedProduct.soldCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#2A2A2A] border-t border-gray-800 p-4 transform transition-transform duration-300 z-50 ${
          isStickyBarVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img
              src={product.mainImage || product.images?.[0]}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-white font-medium line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold">
                  ${finalPrice.toFixed(2)}
                </span>
                {product.price > finalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-[#1a1a1a] rounded-lg border border-gray-800 flex items-center justify-center hover:border-purple-500"
              >
                <Minus className="w-3 h-3 text-gray-400" />
              </button>
              <span className="w-12 text-center text-white">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock || 999, quantity + 1))
                }
                className="w-8 h-8 bg-[#1a1a1a] rounded-lg border border-gray-800 flex items-center justify-center hover:border-purple-500"
              >
                <Plus className="w-3 h-3 text-gray-400" />
              </button>
            </div>
            <AddToCartButton
              product={{
                _id: product._id,
                name: product.name,
                price: finalPrice,
                inStock: inStock,
                images: product.images,
                image: product.mainImage,
              }}
              quantity={quantity}
              variant="default"
              size="md"
              showIcon={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
