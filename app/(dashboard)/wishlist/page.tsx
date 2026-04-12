// app/dashboard/wishlist/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Trash2,
  ShoppingCart,
  Share2,
  Settings,
  X,
  Loader2,
  MoveRight,
  AlertCircle,
  ChevronRight,
  Home,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useUserAuth } from '../../contexts/UserAuthContext';

export default function WishlistPage() {
  const { wishlist, isLoading, removeFromWishlist, clearWishlist, moveToCart, updateSettings, getShareableLink, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useUserAuth();
  const [isMoving, setIsMoving] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    name: wishlist?.name || 'My Wishlist',
    isPublic: wishlist?.isPublic || false,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Refresh wishlist when component mounts
  useEffect(() => {
    if (user) {
      refreshWishlist();
    }
  }, [user, refreshWishlist]);

  // Update settings when wishlist changes
  useEffect(() => {
    if (wishlist) {
      setSettings({
        name: wishlist.name || 'My Wishlist',
        isPublic: wishlist.isPublic || false,
      });
    }
  }, [wishlist]);

  const handleMoveToCart = async (itemId: string, product: any) => {
    setIsMoving(itemId);
    const success = await moveToCart(itemId, 1, product.platform?.[0]);
    setIsMoving(null);
    
    if (success) {
      toast.success(`${product.name} moved to cart`);
    }
  };

  const handleRemove = async (itemId: string, productName: string) => {
    setIsRemoving(itemId);
    const success = await removeFromWishlist(itemId);
    setIsRemoving(null);
    
    if (success) {
      toast.success(`${productName} removed from wishlist`);
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear your entire wishlist? This action cannot be undone.')) {
      await clearWishlist();
      toast.success('Wishlist cleared');
    }
  };

  const handleUpdateSettings = async () => {
    setIsUpdating(true);
    const success = await updateSettings(settings.name, settings.isPublic);
    setIsUpdating(false);
    if (success) {
      setShowSettings(false);
      toast.success('Wishlist settings updated');
    }
  };

  const handleShare = async () => {
    const link = getShareableLink();
    if (!link) {
      toast.error('Make your wishlist public first to share it');
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      toast.success('Shareable link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h1>
          <p className="text-gray-400 mb-6">
            Save your favorite items here and come back to them anytime.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            Start Shopping
            <MoveRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-purple-400 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/dashboard" className="hover:text-purple-400 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Wishlist</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{wishlist.name}</h1>
            <p className="text-gray-400 mt-1">
              {wishlist.totalItems} {wishlist.totalItems === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-gray-400 hover:text-white rounded-lg transition flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            {wishlist.isPublic && (
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-gray-400 hover:text-white rounded-lg transition flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((item: any) => (
            <div
              key={item._id}
              className="group bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Product Image */}
              <Link href={`/product/${item.product.slug || item.product._id}`} className="block relative aspect-square overflow-hidden bg-[#1f1f1f]">
                <img
                  src={item.product.images?.[0] || '/placeholder.png'}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {item.product.discountPrice && item.product.discountPrice < item.product.price && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                    -{Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100)}%
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(item._id, item.product.name);
                  }}
                  disabled={isRemoving === item._id}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                >
                  {isRemoving === item._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${item.product.slug || item.product._id}`}>
                  <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1 hover:text-purple-400 transition">
                    {item.product.name}
                  </h3>
                </Link>
                
                {item.product.brand && (
                  <p className="text-sm text-gray-500 mb-2">{item.product.brand}</p>
                )}

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-purple-400 font-bold text-xl">
                    ${(item.product.finalPrice || item.product.price).toFixed(2)}
                  </span>
                  {item.product.discountPrice && item.product.discountPrice < item.product.price && (
                    <span className="text-gray-500 text-sm line-through">
                      ${item.product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {item.product.platform && item.product.platform.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.product.platform.slice(0, 2).map((platform: any) => (
                      <span
                        key={platform}
                        className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item._id, item.product)}
                    disabled={isMoving === item._id || item.product.stock === 0}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMoving === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Move to Cart
                      </>
                    )}
                  </button>
                </div>

                {item.product.stock === 0 && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Out of Stock
                  </p>
                )}

                {item.note && (
                  <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">
                    Note: {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#2A2A2A] rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Wishlist Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Wishlist Name
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="My Wishlist"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Make Wishlist Public</p>
                    <p className="text-sm text-gray-500">
                      Anyone with the link can view your wishlist
                    </p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, isPublic: !settings.isPublic })}
                    className={`relative w-12 h-6 rounded-full transition ${
                      settings.isPublic ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                        settings.isPublic ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateSettings}
                    disabled={isUpdating}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}