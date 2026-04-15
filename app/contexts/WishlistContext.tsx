"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUserAuth } from "./UserAuthContext";

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    finalPrice: number;
    images: string[];
    stock: number;
    slug: string;
    rating?: number;
    brand?: string;
    platform?: string[];
  };
  addedAt: string;
  note?: string;
}

interface Wishlist {
  _id: string;
  name: string;
  isPublic: boolean;
  shareId?: string;
  totalItems: number;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

interface WishlistContextType {
  wishlist: Wishlist | null;
  isLoading: boolean;
  addToWishlist: (productId: string, note?: string) => Promise<boolean>;
  removeFromWishlist: (itemId: string) => Promise<boolean>;
  clearWishlist: () => Promise<boolean>;
  moveToCart: (
    itemId: string,
    quantity?: number,
    platform?: string,
  ) => Promise<boolean>;
  updateSettings: (name?: string, isPublic?: boolean) => Promise<boolean>;
  checkInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  getShareableLink: () => string;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useUserAuth();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

  const refreshWishlist = useCallback(async () => {
    if (!token || !user) {
      setWishlist(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching wishlist...");
      const response = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Wishlist response:", response.data);

      if (response.data.success) {
        setWishlist(response.data.wishlist);
      } else {
        setWishlist(null);
      }
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setWishlist(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, user, API_URL]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  // FIXED: Changed endpoint from /add/${productId} to /add with body
  const addToWishlist = async (
    productId: string,
    note?: string,
  ): Promise<boolean> => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      return false;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/wishlist/add`,
        { productId, note },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist);
        toast.success("Added to wishlist");

        // Dispatch custom event for real-time updates
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("wishlist-updated", {
              detail: { action: "add", productId },
            }),
          );
        }

        return true;
      }
      return false;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to add to wishlist";
      toast.error(message);
      return false;
    }
  };

  const removeFromWishlist = async (itemId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await axios.delete(
        `${API_URL}/api/wishlist/remove/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist);
        toast.success("Removed from wishlist");

        // Dispatch custom event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("wishlist-updated", {
              detail: { action: "remove", itemId },
            }),
          );
        }

        return true;
      }
      return false;
    } catch (error) {
      toast.error("Failed to remove from wishlist");
      return false;
    }
  };

  const clearWishlist = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await axios.delete(`${API_URL}/api/wishlist/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setWishlist(response.data.wishlist);
        toast.success("Wishlist cleared");

        // Dispatch custom event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("wishlist-updated", {
              detail: { action: "clear" },
            }),
          );
        }

        return true;
      }
      return false;
    } catch (error) {
      toast.error("Failed to clear wishlist");
      return false;
    }
  };

  const moveToCart = async (
    itemId: string,
    quantity: number = 1,
    platform?: string,
  ): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await axios.post(
        `${API_URL}/api/wishlist/move-to-cart/${itemId}`,
        { quantity, platform },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist);
        toast.success("Moved to cart");
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to move to cart");
      return false;
    }
  };

  const updateSettings = async (
    name?: string,
    isPublic?: boolean,
  ): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await axios.put(
        `${API_URL}/api/wishlist/settings`,
        { name, isPublic },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        if (wishlist) {
          setWishlist({
            ...wishlist,
            name: response.data.wishlist.name,
            isPublic: response.data.wishlist.isPublic,
            shareId: response.data.wishlist.shareId,
          });
        }
        toast.success("Settings updated");
        return true;
      }
      return false;
    } catch (error) {
      toast.error("Failed to update settings");
      return false;
    }
  };

  const checkInWishlist = useCallback(
    (productId: string): boolean => {
      if (!wishlist?.items) return false;
      return wishlist.items.some((item) => item.product._id === productId);
    },
    [wishlist],
  );

  const getShareableLink = (): string => {
    if (!wishlist?.shareId) return "";
    return `${window.location.origin}/wishlist/shared/${wishlist.shareId}`;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        updateSettings,
        checkInWishlist,
        refreshWishlist,
        getShareableLink,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
