"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  X, 
  Star, 
  Package, 
  Tag, 
  Building2, 
  Newspaper, 
  TrendingUp,
  Clock,
  ShoppingBag,
  Eye,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { debounce } from "lodash";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  finalPrice: number;
  discount: number;
  rating: number | string;
  stock: number;
  category?: any;
  brand?: any;
  type: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  type: string;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  type: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  views: number;
  createdAt: string;
  type: string;
}

interface SearchData {
  products?: { items: Product[]; total: number };
  categories?: { items: Category[]; total: number };
  brands?: { items: Brand[]; total: number };
  blogs?: { items: Blog[]; total: number };
}

// Helper function to safely convert any value to string
const safeToString = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    // If it has a name property (most common case)
    if (value.name && typeof value.name === 'string') return value.name;
    // If it has a title property
    if (value.title && typeof value.title === 'string') return value.title;
    // If it's a date
    if (value instanceof Date) return value.toLocaleDateString();
    // Don't try to stringify complex objects
    return '';
  }
  return '';
};

// Helper to safely get rating as number
const safeRating = (rating: any): number => {
  if (rating === null || rating === undefined) return 0;
  if (typeof rating === 'number') return rating;
  if (typeof rating === 'string') {
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Helper to safely get price
const safePrice = (price: any): number => {
  if (price === null || price === undefined) return 0;
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const SearchComps = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchData>({});
  const [activeTab, setActiveTab] = useState<"all" | "products" | "categories" | "brands" | "blogs">("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const popularSearches = [
    "Gaming Mouse", "Mechanical Keyboard", "Gaming Headset", 
    "Monitor", "Gaming Chair", "Graphics Card", "Processor", "RAM"
  ];

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (!query || query.trim().length === 0) {
        setSearchData({});
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://gamersbd-server.onrender.com'}/api/search?q=${encodeURIComponent(query.trim())}&limit=50`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
          setSearchData(result.data);
        } else {
          setSearchData({});
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchData({});
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim() || term === initialQuery) return;
    const stored = localStorage.getItem("recentSearches");
    let searches: string[] = stored ? JSON.parse(stored) : [];
    searches = [term, ...searches.filter(s => s !== term)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    setRecentSearches(searches);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(value)}`);
      performSearch(value);
    } else {
      window.history.pushState({}, "", "/search");
      setSearchData({});
    }
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    saveRecentSearch(term);
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(term)}`);
    performSearch(term);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchData({});
    window.history.pushState({}, "", "/search");
  };

  const renderStars = (rating: number) => {
    if (rating === 0) return null;
    
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
            }`}
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Safe Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    // Safely extract all values
    const productName = safeToString(product.name);
    const productSlug = safeToString(product.slug);
    const productImage = product.images?.[0] || "https://placehold.co/400x400/1a1a1a/ffffff?text=No+Image";
    const productDiscount = safePrice(product.discount);
    const productPrice = safePrice(product.price);
    const productFinalPrice = safePrice(product.finalPrice) || productPrice;
    const productRating = safeRating(product.rating);
    const brandName = safeToString(product.brand);
    const categoryName = safeToString(product.category);
    const description = safeToString(product.shortDescription) || safeToString(product.description);
    
    return (
      <Link href={`/product/${productSlug}`} className="group">
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="relative">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {productDiscount > 0 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{productDiscount}%
              </div>
            )}
            <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-orange-500 transition-colors">
              <Heart className="h-4 w-4 text-white" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {brandName && (
                <span className="text-xs text-purple-400">{brandName}</span>
              )}
              {categoryName && (
                <span className="text-xs text-gray-500">{categoryName}</span>
              )}
            </div>
            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
              {productName}
            </h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-orange-500">
                  ${productFinalPrice.toFixed(2)}
                </span>
                {productDiscount > 0 && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${productPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {renderStars(productRating)}
            </div>
            <button className="w-full mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    );
  };

  const CategoryCard = ({ category }: { category: Category }) => {
    const categoryName = safeToString(category.name);
    const categorySlug = safeToString(category.slug);
    const categoryDesc = safeToString(category.description);
    
    return (
      <Link href={`/category/${categorySlug}`} className="group">
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Tag className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold text-white group-hover:text-orange-500 transition-colors">
            {categoryName}
          </h3>
          {categoryDesc && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{categoryDesc}</p>
          )}
        </div>
      </Link>
    );
  };

  const BrandCard = ({ brand }: { brand: Brand }) => {
    const brandName = safeToString(brand.name);
    const brandSlug = safeToString(brand.slug);
    const brandDesc = safeToString(brand.description);
    const brandLogo = brand.logo || null;
    
    return (
      <Link href={`/brand/${brandSlug}`} className="group">
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 text-center p-6">
          {brandLogo ? (
            <img src={brandLogo} alt={brandName} className="h-16 object-contain mx-auto mb-3" />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          )}
          <h3 className="font-semibold text-white group-hover:text-orange-500 transition-colors">
            {brandName}
          </h3>
          {brandDesc && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{brandDesc}</p>
          )}
        </div>
      </Link>
    );
  };

  const BlogCard = ({ blog }: { blog: Blog }) => {
    const blogTitle = safeToString(blog.title);
    const blogSlug = safeToString(blog.slug);
    const blogExcerpt = safeToString(blog.excerpt);
    const blogImage = blog.image || "https://placehold.co/400x200/1a1a1a/ffffff?text=Blog";
    const blogAuthor = safeToString(blog.author) || 'Admin';
    const blogDate = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recent';
    const blogViews = blog.views || 0;
    
    return (
      <Link href={`/blog/${blogSlug}`} className="group">
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300">
          <img 
            src={blogImage} 
            alt={blogTitle} 
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-orange-400">Article</span>
              <span className="text-xs text-gray-500">{blogDate}</span>
            </div>
            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
              {blogTitle}
            </h3>
            {blogExcerpt && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-3">{blogExcerpt}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">By {blogAuthor}</span>
              <div className="flex items-center gap-1 text-gray-500">
                <Eye className="h-3 w-3" />
                <span className="text-xs">{blogViews}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const EmptyState = ({ title, message, icon: Icon }: { title: string; message: string; icon: any }) => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-10 w-10 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{message}</p>
    </div>
  );

  // Safe data extraction
  const totalProducts = searchData.products?.total ?? 0;
  const totalCategories = searchData.categories?.total ?? 0;
  const totalBrands = searchData.brands?.total ?? 0;
  const totalBlogs = searchData.blogs?.total ?? 0;
  const hasResults = totalProducts > 0 || totalCategories > 0 || totalBrands > 0 || totalBlogs > 0;

  const productItems = searchData.products?.items ?? [];
  const categoryItems = searchData.categories?.items ?? [];
  const brandItems = searchData.brands?.items ?? [];
  const blogItems = searchData.blogs?.items ?? [];

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search products, categories, brands..."
              className="w-full h-14 pl-12 pr-12 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        )}

        {!loading && searchQuery && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                {hasResults ? (
                  <>Found {totalProducts + totalCategories + totalBrands + totalBlogs} results for "{searchQuery}"</>
                ) : (
                  <>No results found for "{searchQuery}"</>
                )}
              </h1>
              {hasResults && (
                <p className="text-gray-400 text-sm">
                  {totalProducts > 0 && `${totalProducts} products`}
                  {totalCategories > 0 && ` · ${totalCategories} categories`}
                  {totalBrands > 0 && ` · ${totalBrands} brands`}
                  {totalBlogs > 0 && ` · ${totalBlogs} articles`}
                </p>
              )}
            </div>

            {hasResults && (
              <div className="flex flex-wrap justify-center gap-1 mb-8 border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "all"
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  All ({totalProducts + totalCategories + totalBrands + totalBlogs})
                </button>
                {totalProducts > 0 && (
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                      activeTab === "products"
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    Products ({totalProducts})
                  </button>
                )}
                {totalCategories > 0 && (
                  <button
                    onClick={() => setActiveTab("categories")}
                    className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                      activeTab === "categories"
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Tag className="h-4 w-4" />
                    Categories ({totalCategories})
                  </button>
                )}
                {totalBrands > 0 && (
                  <button
                    onClick={() => setActiveTab("brands")}
                    className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                      activeTab === "brands"
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    Brands ({totalBrands})
                  </button>
                )}
                {totalBlogs > 0 && (
                  <button
                    onClick={() => setActiveTab("blogs")}
                    className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                      activeTab === "blogs"
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Newspaper className="h-4 w-4" />
                    Articles ({totalBlogs})
                  </button>
                )}
              </div>
            )}

            {(activeTab === "all" || activeTab === "products") && productItems.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-4">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productItems.slice(0, activeTab === "all" ? 4 : undefined).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {activeTab === "all" && totalProducts > 4 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setActiveTab("products")}
                      className="text-orange-500 hover:text-orange-400 text-sm"
                    >
                      View all {totalProducts} products →
                    </button>
                  </div>
                )}
              </div>
            )}

            {(activeTab === "all" || activeTab === "categories") && categoryItems.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryItems.slice(0, activeTab === "all" ? 4 : undefined).map((category) => (
                    <CategoryCard key={category._id} category={category} />
                  ))}
                </div>
                {activeTab === "all" && totalCategories > 4 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setActiveTab("categories")}
                      className="text-orange-500 hover:text-orange-400 text-sm"
                    >
                      View all {totalCategories} categories →
                    </button>
                  </div>
                )}
              </div>
            )}

            {(activeTab === "all" || activeTab === "brands") && brandItems.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-4">Brands</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {brandItems.slice(0, activeTab === "all" ? 4 : undefined).map((brand) => (
                    <BrandCard key={brand._id} brand={brand} />
                  ))}
                </div>
                {activeTab === "all" && totalBrands > 4 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setActiveTab("brands")}
                      className="text-orange-500 hover:text-orange-400 text-sm"
                    >
                      View all {totalBrands} brands →
                    </button>
                  </div>
                )}
              </div>
            )}

            {(activeTab === "all" || activeTab === "blogs") && blogItems.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-4">Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogItems.slice(0, activeTab === "all" ? 3 : undefined).map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>
                {activeTab === "all" && totalBlogs > 3 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setActiveTab("blogs")}
                      className="text-orange-500 hover:text-orange-400 text-sm"
                    >
                      View all {totalBlogs} articles →
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">What are you looking for?</h2>
            <p className="text-gray-400 mb-8">Search for products, categories, or brands</p>
            
            <div className="max-w-2xl mx-auto">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-400">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(term)}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && searchQuery && !hasResults && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
            <p className="text-gray-400">
              Try searching for something else or browse our categories
            </p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Truck className="h-4 w-4 text-orange-500" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Shield className="h-4 w-4 text-orange-500" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <RotateCcw className="h-4 w-4 text-orange-500" />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComps;