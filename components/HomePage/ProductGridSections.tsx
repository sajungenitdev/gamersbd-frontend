// components/ProductGridSections.tsx
"use client";
import React from "react";
import {
  ClockIcon,
  TrendingUpIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";

const ProductGridSections = () => {
  const sections = [
    {
      id: "new-releases",
      title: "Top Sellers",
      icon: <SparklesIcon className="w-5 h-5" />,
      products: [
        {
          id: 1,
          name: "Baseball cap",
          price: 864,
          rewardPoints: null,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-finalfantasyviiremakeintergrade-squareenix-g1a-01-1920x1080-05bc7f9ce725-150x150.jpg",
        },
        {
          id: 2,
          name: "Billfold Wallet",
          price: 470,
          rewardPoints: null,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-sifustandardedition-sloclap-g2-00-1920x1080-edb885b62a36-150x150.jpg",
        },
        {
          id: 3,
          name: "Ant Studded Collar Shirt",
          price: 500,
          rewardPoints: 10000,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-sifustandardedition-sloclap-g1a-06-1920x1080-b45863e5563b-150x150.jpg",
        },
      ],
    },
    {
      id: "top-sellers",
      title: "Top Free to Play",
      icon: <TrendingUpIcon className="w-5 h-5" />,
      products: [
        {
          id: 6,
          name: "Baseball cap",
          price: 864,
          rewardPoints: null,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-finalfantasyviiremakeintergrade-squareenix-g1a-01-1920x1080-05bc7f9ce725-150x150.jpg",
        },
        {
          id: 7,
          name: "Billfold Wallet",
          price: 470,
          rewardPoints: null,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-sifustandardedition-sloclap-g2-00-1920x1080-edb885b62a36-150x150.jpg",
        },
        {
          id: 8,
          name: "Ant Studded Collar Shirt",
          price: 500,
          rewardPoints: 10000,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-sifustandardedition-sloclap-g1a-06-1920x1080-b45863e5563b-150x150.jpg",
        },
      ],
    },
    {
      id: "coming-soon",
      title: "Top Upcoming Wishlisted",
      icon: <ClockIcon className="w-5 h-5" />,
      products: [
        {
          id: 11,
          name: "Baseball cap",
          price: 864,
          rewardPoints: null,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-finalfantasyviiremakeintergrade-squareenix-g1a-01-1920x1080-05bc7f9ce725-150x150.jpg",
        },
        {
          id: 12,
          name: "Billfold Wallet",
          price: 470,
          rewardPoints: null,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-sifustandardedition-sloclap-g2-00-1920x1080-edb885b62a36-150x150.jpg",
        },
        {
          id: 13,
          name: "Ant Studded Collar Shirt",
          price: 500,
          rewardPoints: 10000,
          image:
            "https://gamersbd.com/wp-content/uploads/2015/12/egs-sifustandardedition-sloclap-g1a-06-1920x1080-b45863e5563b-150x150.jpg",
        },
      ],
    },
  ];

  return (
    <section className="py-16 pt-8 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl text-white dark:text-black">
            Discover Our Collections
          </h2>
          <p className="text-gray-400 dark:text-gray-600 max-w-2xl mx-auto">
            Explore our latest arrivals, best-selling items, and upcoming
            products
          </p>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-800 dark:bg-gray-200 rounded-lg flex items-center justify-center text-white dark:text-black">
                  {section.icon}
                </div>
                <h3 className="text-1xl md:text-2xl text-white dark:text-black">
                  {section.title}
                </h3>
              </div>

              {/* Product List */}
              <div
                className={`space-y-3 ${section.id !== sections[sections.length - 1].id ? "border-r border-gray-600 dark:border-gray-400 pr-4" : ""}`}
              >
                {section.products.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-2 items-center rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    {/* Product Image */}
                    <div className="w-28 h-36 rounded-lg overflow-hidden bg-gray-800 dark:bg-gray-200 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-white dark:text-black line-clamp-1">
                        {product.name}
                      </h4>

                      {product.rewardPoints && (
                        <p className="text-xs text-amber-500 dark:text-amber-600 mt-0.5">
                          Earn {product.rewardPoints.toLocaleString()} points
                        </p>
                      )}

                      <p className="text-sm font-semibold text-white dark:text-black mt-1">
                        £
                        {typeof product.price === "number"
                          ? product.price.toLocaleString()
                          : product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Link */}
              <Link href={`/shop`} className="flex justify-start">
                <button className="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black transition-colors group">
                  View all
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGridSections;
