// components/EditorsPicks.tsx
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  StarIcon,
} from "lucide-react";
import React from "react";

// Sample editor's picks data based on your image
const gamesAchivement = [
  {
    id: 1,
    name: "SIFU",
    category: "testtest product",
    price: 456,
    originalPrice: 760,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
    editorRating: 4.8,
  },
  {
    id: 2,
    name: "Baseball Cap",
    category: "Accessories",
    price: 864,
    originalPrice: 1080,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
    editorRating: 4.5,
  },
  {
    id: 3,
    name: "Block Blouse",
    category: "Contemporary",
    price: 300,
    originalPrice: 500,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1624206112918-f140f087f9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
    editorRating: 4.7,
  },
  {
    id: 4,
    name: "Daiki Blouse",
    category: "Contemporary",
    price: 500,
    originalPrice: 650,
    discount: 23,
    image:
      "https://images.unsplash.com/photo-1614251056216-f1d4b13507f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
    editorRating: 4.6,
  },
  {
    id: 5,
    name: "Billfold Wallet",
    category: "Accessories",
    price: 540,
    originalPrice: 600,
    discount: 10,
    image:
      "https://images.unsplash.com/photo-1627222784012-94ef2c4c81c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
    editorRating: 4.4,
  },
  {
    id: 6,
    name: "Crochet Cardigan",
    category: "Contemporary",
    price: 730,
    originalPrice: 912,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
    editorRating: 4.9,
  },
  {
    id: 7,
    name: "Dress",
    category: "Contemporary",
    price: 470,
    originalPrice: 670,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2A2A2A] dark:bg-white",
    editorRating: 4.5,
  },
];

const GamesAchivement = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [favorites, setFavorites] = React.useState<number[]>([]);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  };

  const [itemsToShow, setItemsToShow] = React.useState(4);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsToShow(4);
      else if (window.innerWidth >= 768) setItemsToShow(2);
      else setItemsToShow(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, gamesAchivement.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  return (
    <section className="py-16 bg-[#1a1a1a] dark:bg-white transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-black">
                Games with Achievements
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Curated just for you by our team
              </p>
            </div>
          </div>

          {/* Discount Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full">
            <span className="text-2xl font-black">UP TO</span>
            <span className="text-4xl font-black">-40%</span>
          </div>
        </div>

        {/* Mobile Discount Badge */}
        <div className="lg:hidden flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full">
            <span className="text-lg font-bold">UP TO</span>
            <span className="text-2xl font-black">-40%</span>
          </div>
        </div>

        {/* Slider Container */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform bg-[#1a1a1a] dark:bg-white duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {gamesAchivement.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                  style={{
                    flexBasis: `calc(${100 / itemsToShow}% - ${itemsToShow > 1 ? 24 : 0}px)`,
                  }}
                >
                  <div className="group/card relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <HeartIcon
                        className={`w-5 h-5 ${
                          favorites.includes(item.id)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </button>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{item.discount}%
                    </div>

                    {/* Image Container */}
                    <div
                      className={`${item.bgColor} aspect-square p-6 relative overflow-hidden`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transform group-hover/card:scale-110 transition-transform duration-500"
                      />

                      {/* Editor's Choice Badge */}
                      <div className="absolute bottom-4 left-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <StarIcon className="w-3 h-3 fill-current" />
                        <span>Editor's Pick</span>
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-4 right-4 bg-black/70 dark:bg-white/90 text-white dark:text-black px-2 py-1 rounded-lg text-sm font-bold">
                        ★ {item.editorRating}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 bg-[#2a2a2a] dark:bg-white">
                      <p className="text-sm text-white dark:text-black mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-semibold text-white dark:text-black mb-2">
                        {item.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-white dark:text-black">
                          ${item.price}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                          ${item.originalPrice}
                        </span>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                          Add to Cart
                        </button>
                        <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-white dark:text-black hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
          )}

          {currentIndex < maxIndex && (
            <button
              onClick={nextSlide}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Progress Indicators */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all ${
                index === currentIndex
                  ? "w-8 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
                  : "w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesAchivement;
