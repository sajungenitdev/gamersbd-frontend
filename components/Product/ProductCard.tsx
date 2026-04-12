// app/components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye, Star, Flame, Zap } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCurrency } from "../../app/contact/CurrencyContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  finalPrice: number;
  description: string;
  shortDescription: string;
  mainImage: string;
  images: string[];
  stock: number;
  availability: string;
  category: { _id: string; name: string };
  platform: string[];
  rating?: string;
  soldCount: number;
  inStock: boolean;
  offerBadge?: string | null;
  offerBadgeColor?: string | null;
  isDealActive?: boolean;
}

interface ProductCardProps {
  product: Product;
  categorySlug: string;
  viewMode: "grid" | "list";
}

const ProductCard = ({ product, categorySlug, viewMode }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load wishlist status from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setIsWishlisted(favorites.includes(product._id));
    }
  }, [product._id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add to wishlist');
        return;
      }

      let newFavorites;
      if (isWishlisted) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        newFavorites = JSON.parse(localStorage.getItem('favorites') || '[]').filter((id: string) => id !== product._id);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
          productId: product._id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        newFavorites = [...JSON.parse(localStorage.getItem('favorites') || '[]'), product._id];
        toast.success('Added to wishlist');
      }

      setIsWishlisted(!isWishlisted);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find((item: any) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        existingCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success(`Added ${product.name} to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const getBadgeColor = (badge?: string, color?: string | null) => {
    if (color) {
      const colorMap: Record<string, string> = {
        red: "from-red-600 to-red-500",
        green: "from-green-600 to-green-500",
        yellow: "from-yellow-600 to-yellow-500",
        purple: "from-purple-600 to-purple-500",
      };
      return colorMap[color] || "from-purple-600 to-purple-700";
    }

    const badgeColors: Record<string, string> = {
      New: "from-emerald-600 to-emerald-700",
      Sale: "from-red-600 to-red-700",
      Hot: "from-orange-600 to-orange-700",
      Limited: "from-purple-600 to-purple-700",
    };
    return badge ? badgeColors[badge] || "from-purple-600 to-purple-700" : "";
  };

  const getBadgeIcon = (badge?: string) => {
    if (badge === 'Hot') return <Flame className="w-3 h-3" />;
    if (badge === 'New') return <Zap className="w-3 h-3" />;
    return null;
  };

  const ratingValue = product.rating ? parseFloat(product.rating) : 0;

  return (
    <div
      className={`group relative bg-[#1a1a1a] rounded-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-800/50 hover:border-purple-500/50 ${viewMode === "list" ? "flex" : ""
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/${categorySlug}/${product._id}`}
        className={viewMode === "list" ? "flex-1 flex" : "block"}
      >
        {/* Image Container */}
        <div
          className={`relative ${viewMode === "grid" ? "aspect-square" : "w-48 h-48"
            } overflow-hidden bg-[#1a1a1a]`}
        >
          <Image
            src={product.mainImage || "/placeholder-image.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badges */}
          {(product.offerBadge || (product.isDealActive && product.offerBadge)) && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getBadgeColor(product.offerBadge || undefined, product.offerBadgeColor)} text-white shadow-lg flex items-center gap-1`}
              >
                {getBadgeIcon(product.offerBadge || undefined)}
                {product.offerBadge || (product.isDealActive && "Deal")}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3 transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <button
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 transform hover:scale-110"
              title="Quick View"
            >
              <Eye className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={toggleFavorite}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/90 transition-all duration-300 transform hover:scale-110"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart
                className={`w-4 h-4 transition-all ${isWishlisted ? "fill-red-500 text-red-500" : "text-white"
                  }`}
              />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-[#1a1a1a]/95 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white/90 font-medium text-sm px-3 py-1 bg-red-500/20 rounded-full border border-red-500/20">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
          <p className="text-xs text-purple-400 mb-1 uppercase tracking-wider">
            {product.category?.name || "Product"}
          </p>

          <h3 className="text-lg font-medium text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {ratingValue > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(ratingValue)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-600"
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.soldCount || 0} sold)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-white">
              ${product.finalPrice.toFixed(2)}
            </span>
            {product.discountPrice ? (
              <>
                <span className="current-price">{formatPrice(product.discountPrice)}</span>
                <span className="original-price">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="price">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Description (List View Only) */}
          {viewMode === "list" && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {product.shortDescription || product.description}
            </p>
          )}

          {/* Platform Tags (List View Only) */}
          {viewMode === "list" && product.platform && product.platform.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.platform.slice(0, 3).map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-0.5 bg-[#2a2a2a] text-gray-400 text-xs rounded-full"
                >
                  {platform}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            disabled={!product.inStock}
            className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${product.inStock
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                : "bg-[#1a1a1a] text-gray-500 cursor-not-allowed border border-gray-800"
              }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </span>
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;