// components/CatalougeSection.tsx
"use client";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

const CatalougeSection = () => {
  return (
    <section className="pt-5 pb-28 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative group">
            <div className="absolute -inset-1  rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-500" />
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://gamersbd.com/wp-content/uploads/2022/06/egs-featured-titles-blade-16x9-1920x1080-aaf6937d52da.jpg"
                alt="Gaming Collection"
                className="w-full h-[450px] object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">New Arrivals</span>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-black leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d88616] to-pink-400">
                Ultimate Gaming
              </span>
              Experience
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-400 dark:text-gray-600 leading-relaxed">
              Explore our massive collection of premium games, accessories, and
              exclusive merchandise. From action-packed adventures to immersive
              RPGs, find everything you need to level up your gaming setup.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-[#d88616] to-pink-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:gap-3 transition-all hover:shadow-lg hover:shadow-[#d88616]/25">
                Go to Catalog
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group px-8 py-4 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-700 dark:hover:bg-gray-300 transition-all">
                Shop Now
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d88616] to-pink-400 border-2 border-[#1a1a1a] dark:border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-600">
                  2k+ happy customers
                </span>
              </div>
              <div className="w-px h-6 bg-gray-700 dark:bg-gray-300" />
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-400 dark:text-gray-600">
                  4.8/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalougeSection;
