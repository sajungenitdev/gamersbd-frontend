// app/categories/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Gamepad2,
  Monitor,
  Mouse,
  Cpu,
  Armchair,
  Headphones,
  Smartphone,
  Watch,
  Camera,
  Speaker,
  Keyboard,
  Microscope,
  ArrowRight,
  Loader2,
  Package,
  Tag,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  description: string | null;
  image: string | null;
  parent: Category | null;
  level: number;
  isActive: boolean;
  createdAt: string;
  productCount?: number;
  slug?: string;
}

// Icon mapping based on category name
const getCategoryIcon = (categoryName: string): React.ElementType => {
  const name = categoryName.toLowerCase();
  
  const iconMap: { [key: string]: React.ElementType } = {
    gaming: Gamepad2,
    game: Gamepad2,
    electronics: Monitor,
    monitor: Monitor,
    accessories: Mouse,
    mouse: Mouse,
    components: Cpu,
    cpu: Cpu,
    furniture: Armchair,
    chair: Armchair,
    audio: Headphones,
    headphone: Headphones,
    mobile: Smartphone,
    phone: Smartphone,
    wearables: Watch,
    watch: Watch,
    photography: Camera,
    camera: Camera,
    speakers: Speaker,
    speaker: Speaker,
    keyboards: Keyboard,
    keyboard: Keyboard,
    streaming: Microscope,
    microphone: Microscope,
    sports: TrendingUp,
    "war game": Zap,
    "adventure game": Gamepad2,
    "women gym": TrendingUp,
  };
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon;
    }
  }
  
  return Package; // Default icon
};

// Get color gradient based on category name
const getCategoryColor = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  const colorMap: { [key: string]: string } = {
    gaming: "from-purple-600 to-pink-600",
    "adventure game": "from-purple-600 to-pink-600",
    "war game": "from-red-600 to-orange-600",
    electronics: "from-blue-600 to-cyan-600",
    accessories: "from-green-600 to-emerald-600",
    components: "from-red-600 to-orange-600",
    furniture: "from-yellow-600 to-amber-600",
    audio: "from-indigo-600 to-purple-600",
    mobile: "from-teal-600 to-cyan-600",
    wearables: "from-rose-600 to-pink-600",
    photography: "from-violet-600 to-purple-600",
    speakers: "from-cyan-600 to-blue-600",
    keyboards: "from-fuchsia-600 to-purple-600",
    streaming: "from-orange-600 to-red-600",
    sports: "from-green-600 to-teal-600",
    "women gym": "from-pink-600 to-rose-600",
  };
  
  for (const [key, color] of Object.entries(colorMap)) {
    if (name.includes(key)) {
      return color;
    }
  }
  
  return "from-gray-600 to-gray-800";
};

// Get placeholder image based on category
const getCategoryImage = (categoryName: string, categoryImage: string | null): string => {
  if (categoryImage) return categoryImage;
  
  const name = categoryName.toLowerCase();
  const imageMap: { [key: string]: string } = {
    gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500",
    "adventure game": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500",
    "war game": "https://images.unsplash.com/photo-1542751110-97427fec2fd0?w=500",
    electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
    accessories: "https://images.unsplash.com/photo-1618384887929-16ec33a5efc4?w=500",
    components: "https://images.unsplash.com/photo-1591488322449-8f3ce659d3df?w=500",
    furniture: "https://images.unsplash.com/photo-1611072529272-b0673b789167?w=500",
    audio: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    wearables: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
    photography: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    speakers: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    keyboards: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    streaming: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500",
  };
  
  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  return "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500";
};

// Get product count (you can replace this with an actual API call)
const getProductCount = (categoryId: string): number => {
  // This would ideally come from an API endpoint
  // For now, return a random number between 5 and 50
  return Math.floor(Math.random() * 45) + 5;
};

// Category Card Component
const CategoryCard = ({ category }: { category: Category }) => {
  const Icon = getCategoryIcon(category.name);
  const colorGradient = getCategoryColor(category.name);
  const categoryImage = getCategoryImage(category.name, category.image);
  const productCount = category.productCount || getProductCount(category._id);
  
  // Generate slug from name
  const slug = category.name.toLowerCase().replace(/ /g, "-");
  
  return (
    <Link
      href={`/category/${slug}?id=${category._id}`}
      className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-800/50 hover:border-purple-500/50"
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <Image
          src={categoryImage}
          alt={category.name}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative p-6 z-10">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${colorGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Category Info */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {category.name}
        </h3>
        {/* <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {category.description || `Explore our collection of ${category.name.toLowerCase()} products. Find the best deals and latest arrivals.`}
        </p> */}
        
        {/* Level Badge */}
        {category.level === 0 && (
          <div className="mb-2">
            <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
              Main Category
            </span>
          </div>
        )}
        
        {/* Product Count */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-400">
            {productCount} Products
          </span>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
      
      {/* Hover Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colorGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
    </Link>
  );
};

// Sub Category Card (Smaller version for nested categories)
const SubCategoryCard = ({ category }: { category: Category }) => {
  const Icon = getCategoryIcon(category.name);
  const colorGradient = getCategoryColor(category.name);
  const slug = category.name.toLowerCase().replace(/ /g, "-");
  
  return (
    <Link
      // href={`/category/${slug}?id=${category._id}`}
      href={`/${category.name.toLowerCase().replace(/\s+/g, '')}/${category._id}`}
      className="group text-center p-4 bg-[#1a1a1a] rounded-xl hover:bg-purple-600/10 transition-all duration-300 border border-gray-800/50 hover:border-purple-500/50"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorGradient} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-white text-sm group-hover:text-purple-400 transition-colors">
        {category.name}
      </p>
      {category.parent && (
        <p className="text-xs text-gray-500 mt-1">
          {typeof category.parent === 'object' ? category.parent.name : ''}
        </p>
      )}
    </Link>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#0A0A0B] py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-8 w-32 bg-[#1a1a1a] rounded mx-auto mb-4 animate-pulse"></div>
        <div className="h-12 w-64 bg-[#1a1a1a] rounded mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 w-96 bg-[#1a1a1a] rounded mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#1a1a1a] rounded-2xl h-64 animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

// Main Component
const AllCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://gamersbd-server.onrender.com'}/api/categories`);
      
      if (response.data.success) {
        const allCategories = response.data.data;
        setCategories(allCategories);
        
        // Separate parent and sub categories
        const parents = allCategories.filter((cat: Category) => cat.level === 0);
        const subs = allCategories.filter((cat: Category) => cat.level === 1);
        
        setParentCategories(parents);
        setSubCategories(subs);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      toast.error(error.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] py-12 pt-8 px-4">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#2A2A2A",
            color: "#fff",
            border: "1px solid #3f3f46",
            borderRadius: "12px",
          },
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-5 flex justify-between items-center">
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors">
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white">All Categories</span>
          </div>
        </div>

        {/* Main Categories Grid */}
        {parentCategories.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {parentCategories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          </>
        )}

        {/* Sub Categories Section */}
        {subCategories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Sub Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subCategories.map((category) => (
                <SubCategoryCard key={category._id} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* No Categories Message */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Categories Found</h3>
            <p className="text-gray-400">Categories will appear here once added.</p>
          </div>
        )}

        {/* Featured Categories Banner */}
        {categories.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-gray-400 mb-6">
                Browse our complete collection or contact our support team for assistance.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  Browse All Products
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-transparent border border-purple-600 text-purple-400 hover:bg-purple-600/10 rounded-lg transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCategories;