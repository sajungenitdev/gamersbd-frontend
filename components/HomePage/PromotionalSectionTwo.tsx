// components/PromotionalSectionMinimal.tsx
"use client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const PromotionalSectionTwo = () => {
  return (
    <section className="py-12 pt-8 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fortnite */}
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                FORTNITE
              </span>
              <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs rounded">
                EPIC PACK
              </span>
            </div>
            <div>
              <img
                className="rounded-xl"
                src="https://gamersbd.com/wp-content/uploads/2022/06/egs-mega-deal-fn-among-us-breaker-image-1920x1080-da8a4d9b67cf-768x432.jpg"
                alt=""
              />
            </div>
            <h3 className="text-3xl font-inter pt-3 text-white dark:text-black mb-2">
              AmongUs x Fortnite
            </h3>
            <p className="text-white dark:text-black mb-4">
              Get an Among Us-themed Fortnite Back Bling and Emote
            </p>
            <Link
              href="/shop" className="text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Learn More <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* Rogue Company */}
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ROGUE
              </span>
              <span className="text-xl text-gray-500 dark:text-gray-400">
                COMPANY
              </span>
            </div>
            <div>
              <img
                className="rounded-xl"
                src="https://gamersbd.com/wp-content/uploads/2022/06/egs-mega-deal-rogue-comp-breaker-image-1920x1080-515d12cb1c39-768x432.jpg"
                alt=""
              />
            </div>
            <h3 className="text-3xl font-inter pt-3 text-white dark:text-black mb-2">
              Free Unlock
            </h3>
            <p className="text-white dark:text-black mb-4">
              Receive a Rogue (Phantom), weapon wrap, and 20,000 XP for free!
            </p>
            <button className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Learn More <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Fortnite */}
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                FORTNITE
              </span>
              <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs rounded">
                EPIC PACK
              </span>
            </div>
            <div>
              <img
                className="rounded-xl"
                src="https://gamersbd.com/wp-content/uploads/2022/06/egs-mega-deal-fn-among-us-breaker-image-1920x1080-da8a4d9b67cf-768x432.jpg"
                alt=""
              />
            </div>
            <h3 className="text-3xl font-inter pt-3 text-white dark:text-black mb-2">
              AmongUs x Fortnite
            </h3>
            <p className="text-white dark:text-black mb-4">
              Get an Among Us-themed Fortnite Back Bling and Emote
            </p>
            <Link
              href="/shop" className="text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Learn More <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSectionTwo;
