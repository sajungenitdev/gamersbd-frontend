// app/subcategory/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, Star, Package, Loader2, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  originalPrice?: number;
  images?: string[];
  image?: string[];
  mainImage?: string;
  rating?: number | string;
  reviews?: number;
  inStock: boolean;
  stock?: number;
  description?: string;
  badge?: string;
  category?: string | { _id: string; name: string };
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
}

const SubcategoryPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get category name
  const getCategoryName = (product: Product): string => {
    if (!product.category) return "Uncategorized";
    if (typeof product.category === 'string') return product.category;
    return product.category.name || "Uncategorized";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";
        
        // Fetch subcategory details
        const subcategoryResponse = await axios.get(`${API_URL}/api/categories/${id}`);
        
        if (subcategoryResponse.data.success) {
          setSubcategory(subcategoryResponse.data.data);
        }
        
        // Fetch products
        const productsResponse = await axios.get(`${API_URL}/api/categories/${id}/products`);
        
        console.log("Products response:", productsResponse.data);
        
        if (productsResponse.data.success) {
          const formattedProducts = productsResponse.data.data.map((p: any) => ({
            ...p,
            finalPrice: p.discountPrice || p.price,
            originalPrice: p.originalPrice || p.price,
            inStock: (p.stock || 0) > 0,
            rating: typeof p.rating === 'number' ? p.rating : 4.5,
            reviews: p.reviews || 0,
            image: p.images?.[0] || p.mainImage,
            category: p.category,
          }));
          setProducts(formattedProducts);
        } else {
          setError("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const calculateDiscount = (original: number, discounted: number) => {
    if (!original || !discounted || original <= discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  const getDisplayPrice = (price: number) => {
    return price > 1000 ? price / 100 : price;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error || !subcategory) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Subcategory Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The subcategory you are looking for does not exist."}</p>
          <Link href="/shop" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Toaster position="bottom-right" />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm  flex-wrap">
            <Link href="/" className="text-gray-500 hover:text-purple-400 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link href="/all-categories" className="text-gray-500 hover:text-purple-400">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            
            {subcategory?.parentCategory && (
              <>
                <Link 
                  href={`/category/${subcategory.parentCategory.slug}`} 
                  className="text-gray-500 hover:text-purple-400"
                >
                  {subcategory.parentCategory.name}
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </>
            )}
            
            <span className="text-purple-400">{subcategory?.name || id}</span>
          </div>

          {/* Subcategory Header */}
          <div className="text-center">
            {/* <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 capitalize">
              {subcategory?.name}
            </h1> */}
            {subcategory?.description && (
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {subcategory.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-[#2a2a2a] rounded-2xl border border-gray-800">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No products found in {subcategory?.name}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                getCategoryName={getCategoryName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component with your design
const ProductCard = ({ product, getCategoryName }: { product: Product; getCategoryName: (product: Product) => string }) => {
  const finalPrice = product.discountPrice || product.price;
  const displayPrice = finalPrice > 1000 ? finalPrice / 100 : finalPrice;
  const originalPrice = product.originalPrice || product.price;
  const displayOriginalPrice = originalPrice > 1000 ? originalPrice / 100 : originalPrice;
  const discount = originalPrice > finalPrice ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
  const imageUrl = product.image || product.images?.[0] || product.mainImage || "https://via.placeholder.com/300";
  const categoryName = getCategoryName(product);
  const saveAmount = (originalPrice - finalPrice) > 1000 ? (originalPrice - finalPrice) / 100 : (originalPrice - finalPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to cart!`);
  };

  const imageUrlString = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  return (
    <Link href={`/product/${product._id}`}>
      <div className="relative group overflow-hidden rounded-2xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-800 dark:bg-gray-200">
          <img
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 opacity-100"
            loading="lazy"
            src={imageUrlString || '/fallback-image.jpg'} // Add a fallback
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
              -{discount}%
            </div>
          )}
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
              <span className="px-3 py-1 bg-red-500/90 text-white text-sm rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Category Name */}
          <p className="text-sm text-gray-400 dark:text-gray-600 mb-1">
            {categoryName}
          </p>
          
          {/* Product Name & Cart Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white dark:text-black">
              {product.name}
            </h3>
            <button
              onClick={handleAddToCart}
              className="p-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              aria-label={`Add ${product.name} to cart`}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 text-white dark:text-black" />
            </button>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white dark:text-black font-normal text-lg">
              ${displayPrice.toFixed(2)}
            </span>
            {originalPrice > finalPrice && (
              <>
                <span className="text-sm text-gray-400 dark:text-gray-600 line-through">
                  ${displayOriginalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-[#d88616] dark:text-green-600 font-medium">
                  Save ${saveAmount.toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SubcategoryPage;