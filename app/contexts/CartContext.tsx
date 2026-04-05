// app/contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
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
  addingItems: Set<string>;
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
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());
  const isInitialized = useRef(false);

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

  // Transform backend cart response to frontend format
  const transformCartResponse = useCallback((cartData: any): CartItem[] => {
    
    if (!cartData || !cartData.items) {
      console.log("No cart items found");
      return [];
    }
    
    const transformedItems = cartData.items.map((item: any) => {
      const product = item.product;
      const finalPrice = product?.discountPrice || product?.price || 0;
      const originalPrice = product?.price || finalPrice;
      
      return {
        id: item._id, // Cart item ID
        productId: product?._id || item.product,
        name: product?.name || 'Unknown Product',
        price: finalPrice,
        originalPrice: originalPrice,
        quantity: item.quantity,
        image: product?.images?.[0] || product?.mainImage || '/placeholder.png',
        slug: product?.slug,
        inStock: (product?.stock || 0) > 0,
        platform: item.platform || 'PS5',
      };
    });
    
    console.log(`✅ Transformed ${transformedItems.length} cart items`);
    return transformedItems;
  }, []);

  // Fetch cart from backend
  const fetchCartFromBackend = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      console.log("No auth token, skipping backend fetch");
      return null;
    }
    
    try {
      console.log("📡 Fetching cart from backend...");
      const response = await axios.get(`${baseUrl}/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log("📦 Backend response:", response.data);
      
      if (response.data?.success && response.data?.cart) {
        const transformed = transformCartResponse(response.data.cart);
        return transformed;
      }
      
      return null;
    } catch (error: any) {
      console.error("❌ Failed to fetch cart:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        // Token expired, clear it
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
      }
      return null;
    }
  }, [baseUrl, getAuthToken, transformCartResponse]);

  // Load guest cart from localStorage
  const loadGuestCart = useCallback((): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('guest_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`📦 Loaded guest cart: ${parsed.length} items`);
        return parsed;
      }
    } catch (error) {
      console.error("Failed to load guest cart:", error);
    }
    return [];
  }, []);

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((cartItems: CartItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
      console.log(`💾 Saved guest cart: ${cartItems.length} items`);
    } catch (error) {
      console.error("Failed to save guest cart:", error);
    }
  }, []);

  // Refresh cart (main method to load cart)
  const refreshCart = useCallback(async () => {
    console.log("🔄 Refreshing cart...");
    setIsLoading(true);
    
    try {
      if (isLoggedIn()) {
        // Logged in: fetch from backend
        console.log("User is logged in, fetching from backend");
        const backendCart = await fetchCartFromBackend();
        if (backendCart !== null) {
          setItems(backendCart);
        } else if (!isInitialized.current) {
          // If backend fetch fails and not initialized, try guest cart
          const guestCart = loadGuestCart();
          setItems(guestCart);
        }
      } else {
        // Guest: load from localStorage
        console.log("User is guest, loading from localStorage");
        const guestCart = loadGuestCart();
        setItems(guestCart);
      }
    } catch (error) {
      console.error("Failed to refresh cart:", error);
      if (!isLoggedIn()) {
        const guestCart = loadGuestCart();
        setItems(guestCart);
      }
    } finally {
      setIsLoading(false);
      isInitialized.current = true;
    }
  }, [isLoggedIn, fetchCartFromBackend, loadGuestCart]);

  // Add to cart
  const addToCart = useCallback(async (product: any, quantity: number = 1): Promise<boolean> => {
    const productId = product._id || product.id;
    if (!productId) {
      console.error("❌ Product ID is required");
      toast.error("Invalid product");
      return false;
    }

    console.log(`🛒 Adding to cart: ${product.name} (${productId}), quantity: ${quantity}`);
    
    // Mark this product as being added
    setAddingItems(prev => new Set(prev).add(productId));
    
    try {
      if (!isLoggedIn()) {
        // GUEST MODE
        console.log("Guest mode: saving to localStorage");
        
        const finalPrice = product.discountPrice || product.price;
        const newItem: CartItem = {
          id: `${productId}_${Date.now()}`, // Generate unique ID for guest
          productId: productId,
          name: product.name,
          price: finalPrice,
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
            console.log(`Updated existing item quantity to ${updatedItems[existingIndex].quantity}`);
          } else {
            updatedItems = [...prevItems, newItem];
            console.log(`Added new item to cart`);
          }
          
          saveGuestCart(updatedItems);
          return updatedItems;
        });
        
        toast.success(`${product.name} added to cart!`);
        return true;
      }
      
      // AUTH MODE - Call backend
      console.log("Auth mode: calling backend API");
      const token = getAuthToken();
      
      const response = await axios.post(
        `${baseUrl}/api/cart/add`,
        { 
          productId, 
          quantity, 
          platform: product.platform || "PS5" 
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log("Backend response:", response.data);
      
      if (response.data?.success) {
        // Refresh cart to get updated data
        await refreshCart();
        toast.success(`${product.name} added to cart!`);
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to add to cart");
      }
    } catch (error: any) {
      console.error("❌ Add to cart error:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to add to cart";
      toast.error(errorMessage);
      return false;
    } finally {
      setAddingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [isLoggedIn, getAuthToken, baseUrl, saveGuestCart, refreshCart]);

  // Update quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number): Promise<boolean> => {
    console.log(`📝 Updating quantity for item ${itemId} to ${quantity}`);
    
    if (quantity < 1) {
      return removeFromCart(itemId);
    }
    
    try {
      if (!isLoggedIn()) {
        // Guest mode
        setItems(prevItems => {
          const updatedItems = prevItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );
          saveGuestCart(updatedItems);
          return updatedItems;
        });
        return true;
      }
      
      // Auth mode
      const token = getAuthToken();
      const response = await axios.put(
        `${baseUrl}/api/cart/update/${itemId}`,
        { quantity },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data?.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("❌ Update quantity error:", error);
      toast.error(error.response?.data?.message || "Failed to update quantity");
      return false;
    }
  }, [isLoggedIn, getAuthToken, baseUrl, saveGuestCart, refreshCart]);

  // Remove from cart
  const removeFromCart = useCallback(async (itemId: string): Promise<boolean> => {
    console.log(`🗑️ Removing item ${itemId} from cart`);
    
    try {
      if (!isLoggedIn()) {
        // Guest mode
        setItems(prevItems => {
          const updatedItems = prevItems.filter(item => item.id !== itemId);
          saveGuestCart(updatedItems);
          return updatedItems;
        });
        toast.success("Item removed from cart");
        return true;
      }
      
      // Auth mode
      const token = getAuthToken();
      const response = await axios.delete(
        `${baseUrl}/api/cart/remove/${itemId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      
      if (response.data?.success) {
        await refreshCart();
        toast.success("Item removed from cart");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("❌ Remove from cart error:", error);
      toast.error(error.response?.data?.message || "Failed to remove item");
      return false;
    }
  }, [isLoggedIn, getAuthToken, baseUrl, saveGuestCart, refreshCart]);

  // Clear cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    console.log("🗑️ Clearing entire cart");
    
    try {
      if (!isLoggedIn()) {
        // Guest mode
        setItems([]);
        saveGuestCart([]);
        toast.success("Cart cleared");
        return true;
      }
      
      // Auth mode
      const token = getAuthToken();
      const response = await axios.delete(
        `${baseUrl}/api/cart/clear`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      
      if (response.data?.success) {
        setItems([]);
        toast.success("Cart cleared");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("❌ Clear cart error:", error);
      toast.error(error.response?.data?.message || "Failed to clear cart");
      return false;
    }
  }, [isLoggedIn, getAuthToken, baseUrl, saveGuestCart]);

  // Check if a product is being added
  const isAddingProduct = useCallback((productId: string) => {
    return addingItems.has(productId);
  }, [addingItems]);

  // Initialize cart on mount and when login status changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Listen for login/logout events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userToken' || e.key === 'guest_cart') {
        console.log("Storage changed, refreshing cart");
        refreshCart();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshCart]);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    totalItems,
    subtotal,
    isLoading,
    addingItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    isAddingProduct,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};