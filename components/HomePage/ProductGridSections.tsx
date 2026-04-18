// components/ProductGridSections.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  ClockIcon,
  TrendingUpIcon,
  SparklesIcon,
  ArrowRightIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Product type based on your API response
interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  currency: string;
  category: {
    _id: string;
    name: string;
  };
  brand: string;
  mainImage: string;
  images: string[];
  stock: number;
  availability: string;
  type: string;
  offerType: "featured" | "sale" | "new" | "none";
  isFeatured: boolean;
  offerBadge: string;
  offerBadgeColor: string;
  isOnSale: boolean;
  discountPercentage: number;
  rating: string;
  isActive: boolean;
  soldCount: number;
  finalPrice: number;
  offerDisplay: {
    type: string;
    badge: string;
    color: string;
    priority: number;
  };
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  filter: (product: Product) => boolean;
  sort?: (a: Product, b: Product) => number;
  limit?: number;
}

const ProductGridSections = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // Define sections with dynamic filters
  const sections: Section[] = [
    {
      id: "top-sellers",
      title: "Top Sellers",
      icon: <SparklesIcon className="w-5 h-5" />,
      filter: (product) => product.isActive === true,
      sort: (a, b) => (b.soldCount || 0) - (a.soldCount || 0),
      limit: 3,
    },
    {
      id: "free-to-play",
      title: "Best Value",
      icon: <TrendingUpIcon className="w-5 h-5" />,
      filter: (product) =>
        product.finalPrice <= 500 || product.discountPercentage > 20,
      sort: (a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price),
      limit: 3,
    },
    {
      id: "coming-soon",
      title: "Most Wished",
      icon: <ClockIcon className="w-5 h-5" />,
      filter: (product) =>
        product.isOnSale === true || product.offerType === "sale",
      sort: (a, b) => (b.soldCount || 0) - (a.soldCount || 0),
      limit: 3,
    },
  ];

  const getProductImage = (product: Product) => {
    return product.mainImage || product.images?.[0] || "/placeholder.jpg";
  };

  const getSectionProducts = (section: Section) => {
    let filtered = products.filter(section.filter);
    if (section.sort) {
      filtered = filtered.sort(section.sort);
    }
    if (section.limit) {
      filtered = filtered.slice(0, section.limit);
    }
    return filtered;
  };

  if (loading) {
    return (
      <section className="py-16 pt-8 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl text-white dark:text-black">
              Discover Our Collections
            </h2>
            <p className="text-gray-400 dark:text-gray-600 max-w-2xl mx-auto">
              Explore our latest arrivals, best-selling items, and upcoming
              products
            </p>
          </div>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400 dark:text-gray-600">
                Loading products...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 pt-8 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl text-white dark:text-black">
              Discover Our Collections
            </h2>
            <p className="text-gray-400 dark:text-gray-600 max-w-2xl mx-auto">
              Explore our latest arrivals, best-selling items, and upcoming
              products
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500">Error loading products: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 pt-8 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-white dark:text-black font-bold">
            Discover Our Collections
          </h2>
          <p className="text-gray-400 dark:text-gray-600 max-w-2xl mx-auto mt-2">
            Explore our top sellers, best value items, and most wished products
          </p>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => {
            const sectionProducts = getSectionProducts(section);
            const isLastSection = index === sections.length - 1;

            return (
              <div key={index} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700 dark:border-gray-300">
                  <div className="w-8 h-8 bg-gray-800 dark:bg-gray-200 rounded-lg flex items-center justify-center text-white dark:text-black">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white dark:text-black">
                    {section.title}
                  </h3>
                </div>

                {/* Product List */}
                <div
                  className={`space-y-3 ${!isLastSection ? "lg:border-r border-gray-700 dark:border-gray-300 lg:pr-4" : ""}`}
                >
                  {sectionProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 dark:text-gray-600 text-sm">
                        No products available
                      </p>
                    </div>
                  ) : (
                    sectionProducts.map((product) => {
                      const finalPrice = product.finalPrice || product.price;
                      const originalPrice = product.price;
                      const discount =
                        product.isOnSale && finalPrice < originalPrice
                          ? Math.round(
                              ((originalPrice - finalPrice) / originalPrice) *
                                100,
                            )
                          : 0;

                      return (
                        <Link
                          href={`/product/${product._id}`}
                          key={product._id}
                        >
                          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all cursor-pointer group">
                            {/* Product Image */}
                            <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-gray-800 dark:bg-gray-200 flex-shrink-0">
                              <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                              {discount > 0 && (
                                <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 rounded">
                                  -{discount}%
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-medium text-white dark:text-black line-clamp-2 group-hover:text-orange-500 transition-colors">
                                {product.name}
                              </h4>

                              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 line-clamp-1">
                                {product.category?.name || "Uncategorized"}
                              </p>

                              {product.offerType === "featured" && (
                                <p className="text-xs text-amber-500 dark:text-amber-600 mt-0.5">
                                  ⭐ Editor's Pick
                                </p>
                              )}

                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm font-bold text-white dark:text-black">
                                  {product.currency === "BDT"
                                    ? "৳"
                                    : product.currency === "USD"
                                      ? "$"
                                      : product.currency === "EUR"
                                        ? "€"
                                        : product.currency === "GBP"
                                          ? "£"
                                          : product.currency || "$"}
                                  {finalPrice.toFixed(2)}
                                </span>
                                {discount > 0 && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {product.currency || "$"}
                                    {originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {/* Stock indicator */}
                              {product.stock !== undefined &&
                                product.stock < 10 &&
                                product.stock > 0 && (
                                  <p className="text-xs text-orange-500 mt-1">
                                    Only {product.stock} left
                                  </p>
                                )}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

                {/* View All Link */}
                <div className="pt-2">
                  <Link
                    href={"/shop"}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-600 hover:text-orange-500 dark:hover:text-orange-500 transition-colors group"
                  >
                    View all
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGridSections;
