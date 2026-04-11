"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart, ChevronRight, AlertCircle } from "lucide-react";

// Sample wishlist data structure
interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  brand: string;
  rating: number;
  reviewCount: number;
  addedAt: Date;
}

const WishListPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Fetch wishlist items (replace with your actual API call)
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        // Simulate API call - Replace with your actual API
        // const response = await fetch('/api/wishlist');
        // const data = await response.json();
        
        // Sample data
        await new Promise(resolve => setTimeout(resolve, 1000));
        const sampleData: WishlistItem[] = [
          {
            id: "1",
            productId: "prod_001",
            name: "ASUS ROG Strix G15 Gaming Laptop",
            slug: "asus-rog-strix-g15",
            price: 1499.99,
            originalPrice: 1799.99,
            image: "/images/products/laptop1.jpg",
            inStock: true,
            brand: "ASUS",
            rating: 4.5,
            reviewCount: 128,
            addedAt: new Date("2024-01-15"),
          },
          {
            id: "2",
            productId: "prod_002",
            name: "Razer BlackWidow V4 Mechanical Keyboard",
            slug: "razer-blackwidow-v4",
            price: 189.99,
            originalPrice: 229.99,
            image: "/images/products/keyboard1.jpg",
            inStock: true,
            brand: "Razer",
            rating: 4.8,
            reviewCount: 342,
            addedAt: new Date("2024-01-20"),
          },
          {
            id: "3",
            productId: "prod_003",
            name: "Logitech G502 X Plus Wireless Mouse",
            slug: "logitech-g502-x-plus",
            price: 159.99,
            image: "/images/products/mouse1.jpg",
            inStock: false,
            brand: "Logitech",
            rating: 4.7,
            reviewCount: 567,
            addedAt: new Date("2024-01-25"),
          },
          {
            id: "4",
            productId: "prod_004",
            name: "Samsung Odyssey G7 27",
            slug: "samsung-odyssey-g7",
            price: 699.99,
            originalPrice: 899.99,
            image: "/images/products/monitor1.jpg",
            inStock: true,
            brand: "Samsung",
            rating: 4.6,
            reviewCount: 234,
            addedAt: new Date("2024-01-28"),
          },
        ];
        setWishlistItems(sampleData);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (itemId: string) => {
    try {
      // Replace with your actual API call
      // await fetch(`/api/wishlist/${itemId}`, { method: 'DELETE' });
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const addToCart = async (item: WishlistItem) => {
    if (!item.inStock) return;
    
    try {
      // Replace with your actual API call
      // await fetch('/api/cart', {
      //   method: 'POST',
      //   body: JSON.stringify({ productId: item.productId, quantity: 1 })
      // });
      
      // Show success toast/notification
      console.log(`Added ${item.name} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const moveAllToCart = () => {
    wishlistItems.forEach(item => {
      if (item.inStock) {
        addToCart(item);
      }
    });
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };

  const removeSelected = () => {
    setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const totalItems = wishlistItems.length;
  const totalPrice = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-orange-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-orange-500">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">Wishlist</span>
          </div>

          {/* Empty State */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Save your favorite items here and come back to them anytime.
              </p>
              <Link href="/shop" className="btn btn-primary bg-orange-500 hover:bg-orange-600 border-none text-white">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white">Wishlist</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Wishlist
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Products you've saved for later
            </p>
          </div>
          
          <div className="flex gap-3">
            {selectedItems.length > 0 && (
              <button
                onClick={removeSelected}
                className="btn btn-outline btn-error gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove ({selectedItems.length})
              </button>
            )}
            <button
              onClick={moveAllToCart}
              className="btn btn-primary bg-orange-500 hover:bg-orange-600 border-none text-white gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Move All to Cart
            </button>
          </div>
        </div>

        {/* Wishlist Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
              </div>
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">In Stock</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {wishlistItems.filter(item => item.inStock).length}
                </p>
              </div>
              <div className="badge badge-success">Available</div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-1">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={selectedItems.length === wishlistItems.length}
                onChange={toggleSelectAll}
              />
            </div>
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-center">Stock Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
                  {/* Select Checkbox */}
                  <div className="flex items-start md:items-center md:col-span-1">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-4 md:col-span-5">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-orange-500 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.brand}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="rating rating-xs">
                          {[...Array(5)].map((_, i) => (
                            <input
                              key={i}
                              type="radio"
                              name={`rating-${item.id}`}
                              className={`mask mask-star-2 ${
                                i < Math.floor(item.rating)
                                  ? "bg-orange-400"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                              defaultChecked={i < Math.floor(item.rating)}
                              disabled
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({item.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 flex flex-col items-start md:items-end justify-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ${item.price.toFixed(2)}
                    </div>
                    {item.originalPrice && (
                      <div className="text-sm text-gray-400 dark:text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </div>
                    )}
                    {item.originalPrice && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Save ${(item.originalPrice - item.price).toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    {item.inStock ? (
                      <div className="badge badge-success gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        In Stock
                      </div>
                    ) : (
                      <div className="badge badge-error gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className={`btn btn-sm gap-2 ${
                        item.inStock
                          ? "btn-primary bg-orange-500 hover:bg-orange-600 border-none text-white"
                          : "btn-ghost text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="btn btn-sm btn-ghost text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSelectAll}
                  className="btn btn-sm btn-ghost"
                >
                  {selectedItems.length === wishlistItems.length ? "Deselect All" : "Select All"}
                </button>
                {selectedItems.length > 0 && (
                  <button
                    onClick={removeSelected}
                    className="btn btn-sm btn-error"
                  >
                    Remove Selected
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <Link href="/shop" className="btn btn-outline">
                  Continue Shopping
                </Link>
                <button
                  onClick={moveAllToCart}
                  className="btn btn-primary bg-orange-500 hover:bg-orange-600 border-none text-white"
                >
                  Move All to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body p-4">
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListPage;