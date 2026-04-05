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
  TrendingUp,
  Zap,
  ChevronRight,
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
  slug: string;
  subcategories?: Category[];
}

// Icon mapping based on category name
const getCategoryIcon = (categoryName: string): React.ElementType => {
  const name = categoryName.toLowerCase();
  
  const iconMap: { [key: string]: React.ElementType } = {
    gaming: Gamepad2,
    game: Gamepad2,
    "adventure game": Gamepad2,
    "war game": Zap,
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
  };
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon;
    }
  }
  
  return Package;
};

// Get color gradient
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
  };
  
  for (const [key, color] of Object.entries(colorMap)) {
    if (name.includes(key)) {
      return color;
    }
  }
  
  return "from-gray-600 to-gray-800";
};

// Category Card Component
const CategoryCard = ({ category }: { category: Category }) => {
  const Icon = getCategoryIcon(category.name);
  const colorGradient = getCategoryColor(category.name);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-800/50 hover:border-purple-500/50"
    >
      <div className="relative p-6 z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${colorGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {category.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {category.description || `Explore our collection of ${category.name.toLowerCase()} products.`}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-400">
            {hasSubcategories ? `${category.subcategories?.length} Subcategories` : 'View Products'}
          </span>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
      
      <div className={`absolute inset-0 bg-gradient-to-r ${colorGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gamersbd-server.onrender.com';
      
      // Fetch all categories
      const response = await axios.get(`${API_URL}/api/categories/tree`);
      
      if (response.data.success) {
        setCategories(response.data.data);
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

  // Get only top-level categories (level 0)
  const topLevelCategories = categories.filter(cat => cat.level === 0);

  return (
    <div className="min-h-screen bg-[#0A0A0B] py-12 px-4">
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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-purple-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-purple-400">Categories</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop by Category
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our wide range of products across different categories.
            Find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        {topLevelCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topLevelCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Categories Found</h3>
            <p className="text-gray-400">Categories will appear here once added.</p>
          </div>
        )}

        {/* Stats Section */}
        {topLevelCategories.length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-[#1a1a1a] rounded-xl border border-gray-800/50">
              <p className="text-3xl font-bold text-purple-400">{topLevelCategories.length}</p>
              <p className="text-gray-400 mt-1">Main Categories</p>
            </div>
            <div className="text-center p-6 bg-[#1a1a1a] rounded-xl border border-gray-800/50">
              <p className="text-3xl font-bold text-purple-400">
                {categories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)}
              </p>
              <p className="text-gray-400 mt-1">Subcategories</p>
            </div>
            <div className="text-center p-6 bg-[#1a1a1a] rounded-xl border border-gray-800/50">
              <p className="text-3xl font-bold text-purple-400">24/7</p>
              <p className="text-gray-400 mt-1">Support</p>
            </div>
            <div className="text-center p-6 bg-[#1a1a1a] rounded-xl border border-gray-800/50">
              <p className="text-3xl font-bold text-purple-400">100%</p>
              <p className="text-gray-400 mt-1">Secure</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCategories;