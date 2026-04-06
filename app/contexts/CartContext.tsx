// app/contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
  inStock?: boolean;
  platform?: string;
  originalPrice?: number;
}

export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  addToCart: (product: any, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
  isAddingProduct: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
  baseUrl?: string;
}

export const CartProvider = ({ 
  children, 
  baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com"
}: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set()); // Track adding products

  // Helper to get auth token
  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    }
    return null;
  }, []);

  // Helper to check if user is logged in
  const isLoggedIn = useCallback(() => {
    return !!getAuthToken();
  }, [getAuthToken]);

  // Transform cart items from backend format
  const transformCartItems = useCallback((cartData: any): CartItem[] => {
    if (!cartData || !cartData.items || !Array.isArray(cartData.items)) {
      return [];
    }
    
    return cartData.items.map((item: any) => {
      const product = item.product || {};
      const price = product.discountPrice || product.price || 0;
      
      return {
        id: item._id,
        productId: product._id || item.product,
        name: product.name || 'Unknown Product',
        price: price,
        quantity: item.quantity,
        image: product.images?.[0] || product.mainImage || '/placeholder.png',
        slug: product.slug,
        inStock: (product.stock || 0) > 0,
        platform: item.platform || 'PS5',
        originalPrice: product.price || price,
      };
    });
  }, []);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      const savedCart = localStorage.getItem('guest_cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setItems(parsed);
        } catch (e) {
          setItems([]);
        }
      } else {
        setItems([]);
      }
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${baseUrl}/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data?.success && response.data?.cart) {
        const transformed = transformCartItems(response.data.cart);
        setItems(transformed);
      } else {
        setItems([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch cart:", error.message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, getAuthToken, transformCartItems]);

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((cartItems: CartItem[]) => {
    localStorage.setItem('guest_cart', JSON.stringify(cartItems));
  }, []);

  // Add to cart
  const addToCart = useCallback(async (product: any, quantity: number = 1): Promise<boolean> => {
    const productId = product._id || product.id;
    if (!productId) {
      toast.error("Invalid product");
      return false;
    }

    // Mark as adding
    setAddingItems(prev => new Set(prev).add(productId));
    
    try {
      if (!isLoggedIn()) {
        // Guest mode
        const newItem: CartItem = {
          id: `${productId}_${Date.now()}`,
          productId: productId,
          name: product.name,
          price: product.discountPrice || product.price,
          quantity: quantity,
          image: product.image || product.images?.[0],
          inStock: true,
          platform: product.platform || "PS5",
        };

        setItems(prevItems => {
          const existingIndex = prevItems.findIndex(item => item.productId === productId);
          let updatedItems;
          
          if (existingIndex >= 0) {
            updatedItems = [...prevItems];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity
            };
          } else {
            updatedItems = [...prevItems, newItem];
          }
          
          saveGuestCart(updatedItems);
          return updatedItems;
        });
        
        toast.success(`${product.name} added to cart!`);
        return true;
      }
      
      // Auth mode
      const token = getAuthToken();
      const response = await axios.post(
        `${baseUrl}/api/cart/add`,
        { productId, quantity, platform: product.platform || "PS5" },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data?.success && response.data?.cart) {
        const transformed = transformCartItems(response.data.cart);
        setItems(transformed);
        toast.success(`${product.name} added to cart!`);
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to add to cart");
      }
    } catch (error: any) {
      console.error("Add to cart error:", error.message);
      toast.error(error.response?.data?.message || "Failed to add to cart");
      return false;
    } finally {
      // Remove from adding set
      setAddingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [isLoggedIn, getAuthToken, baseUrl, transformCartItems, saveGuestCart]);

  // Check if a product is currently being added
  const isAddingProduct = useCallback((productId: string) => {
    return addingItems.has(productId);
  }, [addingItems]);

  // Update quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number): Promise<boolean> => {
    if (quantity < 1) {
      return removeFromCart(itemId);
    }
    
    try {
      if (!isLoggedIn()) {
        setItems(prevItems => {
          const updatedItems = prevItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );
          saveGuestCart(updatedItems);
          return updatedItems;
        });
        return true;
      }
      
      const token = getAuthToken();
      const response = await axios.put(
        `${baseUrl}/api/cart/update/${itemId}`,
        { quantity },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data?.success && response.data?.cart) {
        const transformed = transformCartItems(response.data.cart);
        setItems(transformed);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Update quantity error:", error);
      toast.error("Failed to update quantity");
      return false;
    }
  }, [isLoggedIn, getAuthToken, baseUrl, transformCartItems, saveGuestCart]);

  // Remove from cart
  const removeFromCart = useCallback(async (itemId: string): Promise<boolean> => {
    try {
      if (!isLoggedIn()) {
        setItems(prevItems => {
          const updatedItems = prevItems.filter(item => item.id !== itemId);
          saveGuestCart(updatedItems);
          return updatedItems;
        });
        toast.success("Item removed");
        return true;
      }
      
      const token = getAuthToken();
      const response = await axios.delete(
        `${baseUrl}/api/cart/remove/${itemId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data?.success && response.data?.cart) {
        const transformed = transformCartItems(response.data.cart);
        setItems(transformed);
        toast.success("Item removed");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Remove from cart error:", error);
      toast.error("Failed to remove item");
      return false;
    }
  }, [isLoggedIn, getAuthToken, baseUrl, transformCartItems, saveGuestCart]);

  // Clear cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      if (!isLoggedIn()) {
        setItems([]);
        saveGuestCart([]);
        toast.success("Cart cleared");
        return true;
      }
      
      const token = getAuthToken();
      await axios.delete(`${baseUrl}/api/cart/clear`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setItems([]);
      toast.success("Cart cleared");
      return true;
    } catch (error: any) {
      console.error("Clear cart error:", error);
      toast.error("Failed to clear cart");
      return false;
    }
  }, [isLoggedIn, getAuthToken, baseUrl, saveGuestCart]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      subtotal,
      isLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
      isAddingProduct, // Now this is properly defined
    }}>
      {children}
    </CartContext.Provider>
  );
};