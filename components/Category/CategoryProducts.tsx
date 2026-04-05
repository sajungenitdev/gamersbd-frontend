// components/CategoryProducts.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Eye,
  Grid3x3,
  List,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  badge?: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

// Demo products data
const demoProducts: Product[] = [
  {
    id: "1",
    name: "Gaming Mouse RGB",
    price: 49.99,
    originalPrice: 79.99,
    description: "High precision gaming mouse with 16000 DPI, RGB lighting, and 8 programmable buttons.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
    category: "gaming",
    badge: "Sale",
    inStock: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    price: 89.99,
    originalPrice: 129.99,
    description: "RGB mechanical gaming keyboard with blue switches, aluminum frame, and wrist rest.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    category: "gaming",
    badge: "Hot",
    inStock: true,
    rating: 4.8,
    reviews: 256,
  },
  {
    id: "3",
    name: "Gaming Headset",
    price: 59.99,
    description: "7.1 surround sound gaming headset with noise-cancelling microphone and RGB lighting.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500",
    category: "gaming",
    badge: "New",
    inStock: true,
    rating: 4.3,
    reviews: 89,
  },
  {
    id: "4",
    name: "Gaming Chair",
    price: 199.99,
    originalPrice: 299.99,
    description: "Ergonomic gaming chair with lumbar support, adjustable armrests, and reclining feature.",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500",
    category: "gaming",
    badge: "Limited",
    inStock: false,
    rating: 4.7,
    reviews: 312,
  },
  {
    id: "5",
    name: "4K Gaming Monitor",
    price: 349.99,
    originalPrice: 499.99,
    description: "27-inch 4K gaming monitor with 144Hz refresh rate, 1ms response time, and G-Sync.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    category: "electronics",
    badge: "Sale",
    inStock: true,
    rating: 4.9,
    reviews: 445,
  },
  {
    id: "6",
    name: "Gaming Mouse Pad",
    price: 19.99,
    description: "Large RGB gaming mouse pad with smooth surface and anti-slip rubber base.",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33a5efc4?w=500",
    category: "accessories",
    inStock: true,
    rating: 4.2,
    reviews: 67,
  },
  {
    id: "7",
    name: "Graphics Card RTX 4070",
    price: 599.99,
    originalPrice: 699.99,
    description: "Next-gen graphics card with ray tracing, 12GB GDDR6X, and DLSS 3 support.",
    image: "https://images.unsplash.com/photo-1591488322449-8f3ce659d3df?w=500",
    category: "components",
    badge: "Hot",
    inStock: true,
    rating: 4.8,
    reviews: 189,
  },
  {
    id: "8",
    name: "Gaming Desk",
    price: 159.99,
    description: "RGB gaming desk with carbon fiber surface, cable management, and cup holder.",
    image: "https://images.unsplash.com/photo-1611072529272-b0673b789167?w=500",
    category: "furniture",
    inStock: true,
    rating: 4.4,
    reviews: 92,
  },
  {
    id: "9",
    name: "Wireless Controller",
    price: 49.99,
    originalPrice: 69.99,
    description: "Wireless gaming controller with rechargeable battery and RGB lighting.",
    image: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=500",
    category: "gaming",
    badge: "Sale",
    inStock: true,
    rating: 4.6,
    reviews: 234,
  },
  {
    id: "10",
    name: "Streaming Webcam",
    price: 79.99,
    description: "1080p HD streaming webcam with autofocus and built-in microphone.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    category: "accessories",
    inStock: true,
    rating: 4.3,
    reviews: 156,
  },
  {
    id: "11",
    name: "Gaming Speakers",
    price: 89.99,
    originalPrice: 119.99,
    description: "2.1 channel RGB gaming speakers with subwoofer and remote control.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    category: "audio",
    badge: "New",
    inStock: true,
    rating: 4.5,
    reviews: 78,
  },
  {
    id: "12",
    name: "CPU Cooler",
    price: 39.99,
    description: "RGB liquid CPU cooler with 240mm radiator and silent fans.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
    category: "components",
    inStock: true,
    rating: 4.4,
    reviews: 112,
  },
];

const CategoryProducts = () => {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params?.categorySlug as string;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const itemsPerPage = 9;

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Filter products by category
  const categoryProducts = demoProducts.filter((product) => {
    if (categorySlug && categorySlug !== 'all') {
      return product.category === categorySlug;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return parseInt(b.id) - parseInt(a.id);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug]);

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let newFavorites;
    if (favorites.includes(productId)) {
      newFavorites = favorites.filter((id) => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`Added ${product.name} to cart!`);
  };

  const getBadgeColor = (badge?: string) => {
    const colors: Record<string, string> = {
      New: "from-emerald-600 to-emerald-700",
      Sale: "from-red-600 to-red-700",
      Hot: "from-orange-600 to-orange-700",
      Limited: "from-purple-600 to-purple-700",
    };
    return badge ? colors[badge] || "from-purple-600 to-purple-700" : "";
  };

  const formatCategoryName = (slug: string) => {
    if (!slug || slug === 'all') return "All Products";
    const names: Record<string, string> = {
      gaming: "Gaming",
      electronics: "Electronics",
      accessories: "Accessories",
      components: "Components",
      furniture: "Furniture",
      audio: "Audio",
    };
    return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Link
              href="/"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white capitalize">
              {formatCategoryName(categorySlug)}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white capitalize">
                {formatCategoryName(categorySlug)}
              </h1>
              <p className="text-gray-400 mt-2">
                Showing {sortedProducts.length} products
              </p>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className={`group relative bg-[#1a1a1a] rounded-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-800/50 hover:border-purple-500/50 ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <Link
                  href={`/${categorySlug}/${product.id}`}
                  className={viewMode === "list" ? "flex-1 flex" : "block"}
                >
                  {/* Image Container */}
                  <div
                    className={`relative ${viewMode === "grid" ? "aspect-square" : "w-48 h-48"} overflow-hidden bg-[#1a1a1a]`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badges */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getBadgeColor(product.badge)} text-white shadow-lg`}
                        >
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 transform hover:scale-110"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/90 transition-all duration-300 transform hover:scale-110"
                        title={
                          favorites.includes(product.id)
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                      >
                        <Heart
                          className={`w-4 h-4 transition-all ${
                            favorites.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-white"
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
                      {product.category}
                    </p>

                    <h3 className="text-lg font-medium text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-bold text-white">
                        ${product.price}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                    </div>

                    {/* Description (List View Only) */}
                    {viewMode === "list" && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => addToCart(product, e)}
                      disabled={!product.inStock}
                      className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                        product.inStock
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
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600/20 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-[#1a1a1a] text-gray-400 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600/20 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;