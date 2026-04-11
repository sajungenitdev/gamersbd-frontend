// components/cart/AddToCartButton.tsx (FIXED VERSION)
"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "../../app/contexts/CartContext";

interface AddToCartButtonProps {
  product: {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    discountPrice?: number;
    inStock: boolean;
    images?: string[];
    image?: string;
    slug?: string;
    platform?: string;
  };
  quantity?: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  className = "",
  variant = "default",
  size = "md",
  showIcon = true,
  onSuccess,
  onError,
}) => {
  const { addToCart, isAddingProduct, items, refreshCart } = useCart(); // ← Added refreshCart here
  const [localAdding, setLocalAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const productId = product._id || product.id;
  const isCurrentlyAdding = isAddingProduct(productId || '') || localAdding;
  const finalPrice = product.discountPrice || product.price;
  const isOutOfStock = !product.inStock;

  // Debug: Log cart items when they change
  useEffect(() => {
    console.log("🛒 Cart items updated:", items.length);
  }, [items]);

  // Reset success state after showing
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🖱️ Add to cart clicked for:", product.name);
    console.log("Product data:", product);
    console.log("Product ID:", productId);

    if (isOutOfStock) {
      toast.error(`${product.name} is out of stock!`);
      return;
    }

    if (!productId) {
      console.error("❌ Product ID is missing", product);
      toast.error("Invalid product");
      return;
    }

    setLocalAdding(true);

    try {
      const success = await addToCart(product, quantity);
      console.log("Add to cart result:", success);

      if (success) {
        setShowSuccess(true);
        onSuccess?.();
        // Force a refresh after 500ms
        setTimeout(() => {
          refreshCart();
        }, 500);
      }
    } catch (error) {
      console.error("❌ Failed to add to cart:", error);
      onError?.(error as Error);
    } finally {
      setLocalAdding(false);
    }
  };

  const sizeClasses = {
    sm: "text-sm rounded-md p-2",
    md: "text-base rounded-lg p-2",
    lg: "text-lg rounded-xl p-2",
  };

  const variantClasses = {
    default: isOutOfStock
      ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
      : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all duration-300",
    outline: isOutOfStock
      ? "border-2 border-gray-700 text-gray-500 cursor-not-allowed bg-transparent"
      : "border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 bg-transparent",
    ghost: "text-amber-600 hover:bg-amber-600/10 transition-all duration-300 bg-transparent",
  };

  const isLoading = isCurrentlyAdding;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isLoading}
      className={`
    w-full font-medium flex items-center justify-center gap-2
    transition-all duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${!isOutOfStock && !isLoading ? "cursor-pointer active:scale-95" : "cursor-not-allowed opacity-70"}
    ${className}
  `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : showSuccess ? (
        <Check className="w-5 h-5" />
      ) : isOutOfStock ? (
        <span>Out of Stock</span>
      ) : (
        showIcon && <ShoppingCart className="w-5 h-5" />
      )}
    </button>
  );
};

export default AddToCartButton;