// components/HomePage/HeroSection.tsx
"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface SliderSlide {
  _id?: string;
  id?: number;
  url: string;
  alt: string;
  link?: string;
  order: number;
}

interface HeroOffer {
  _id?: string;
  id?: number;
  image: string;
  imageBg: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  order: number;
}

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="bg-[#191919] dark:bg-white min-h-[600px]">
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left side skeleton */}
        <div className="lg:col-span-4">
          <div className="bg-gray-800 dark:bg-gray-200 rounded-2xl h-[568px] animate-pulse"></div>
        </div>
        {/* Right side skeletons */}
        <div className="lg:col-span-1 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 dark:bg-gray-200 rounded-xl h-[130px] animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderImages, setSliderImages] = useState<SliderSlide[]>([]);
  const [offers, setOffers] = useState<HeroOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    autoplay: true,
    autoplaySpeed: 5000,
    showArrows: true,
    height: "568px"
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Memoized functions
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const clearAllIntervals = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  const startProgress = useCallback(() => {
    if (!settings.autoplay || sliderImages.length === 0) return;
    
    setProgress(0);
    const startTime = Date.now();
    const duration = settings.autoplaySpeed;

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      if (!isMounted.current) return;
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current!);
        goToNextSlide();
      }
    }, 16);
  }, [settings.autoplay, settings.autoplaySpeed, sliderImages.length, goToNextSlide]);

  const resetProgress = useCallback(() => {
    clearAllIntervals();
    startProgress();
  }, [clearAllIntervals, startProgress]);

  // Optimized fetch with caching and abort controller
  useEffect(() => {
    isMounted.current = true;
    const abortController = new AbortController();
    
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        
        // Check localStorage cache first (5 minute cache)
        const cachedData = localStorage.getItem('heroData');
        const cacheTime = localStorage.getItem('heroDataTimestamp');
        const isCacheValid = cacheTime && (Date.now() - parseInt(cacheTime)) < 5 * 60 * 1000;
        
        if (cachedData && isCacheValid) {
          const data = JSON.parse(cachedData);
          if (isMounted.current) {
            updateStateFromData(data);
            setLoading(false);
          }
          // Still fetch in background for update
          fetchFreshData(abortController.signal);
        } else {
          await fetchFreshData(abortController.signal);
        }
      } catch (err) {
        console.error("Error fetching hero data:", err);
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    const updateStateFromData = (data: any) => {
      if (data.hero?.slider?.slides?.length > 0) {
        setSliderImages(data.hero.slider.slides.slice(0, 8)); // Limit to 8 slides max
        setSettings({
          autoplay: data.hero.slider.settings?.autoplay ?? true,
          autoplaySpeed: data.hero.slider.settings?.autoplaySpeed ?? 5000,
          showArrows: data.hero.slider.settings?.showArrows ?? true,
          height: data.hero.slider.settings?.height ?? "568px"
        });
      }
      
      if (data.hero?.offers?.length > 0) {
        setOffers(data.hero.offers.slice(0, 8)); // Limit to 8 offers max
      }
    };

    const fetchFreshData = async (signal: AbortSignal) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/home-settings`,
          { signal }
        );
        const result = await response.json();
        
        if (result.success && result.data && isMounted.current) {
          updateStateFromData(result.data);
          // Cache the data
          localStorage.setItem('heroData', JSON.stringify(result.data));
          localStorage.setItem('heroDataTimestamp', Date.now().toString());
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Background fetch error:", err);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchHeroData();

    return () => {
      isMounted.current = false;
      abortController.abort();
      clearAllIntervals();
    };
  }, [clearAllIntervals]);

  // Auto-slide effect with cleanup
  useEffect(() => {
    if (!loading && sliderImages.length > 0 && settings.autoplay) {
      const timer = setTimeout(() => {
        startProgress();
      }, 100);
      return () => {
        clearTimeout(timer);
        clearAllIntervals();
      };
    }
  }, [loading, settings.autoplay, sliderImages.length, startProgress, clearAllIntervals]);

  // Reset progress on slide change
  useEffect(() => {
    if (!loading && sliderImages.length > 0) {
      resetProgress();
    }
  }, [currentSlide, loading, sliderImages.length, resetProgress]);

  // Preload next image
  useEffect(() => {
    if (sliderImages.length > 0) {
      const nextIndex = (currentSlide + 1) % sliderImages.length;
      const nextImage = sliderImages[nextIndex];
      if (nextImage?.url) {
        const img = new Image();
        img.src = nextImage.url;
      }
    }
  }, [currentSlide, sliderImages]);

  const nextSlide = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToNextSlide();
  }, [goToNextSlide]);

  const prevSlide = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  }, [sliderImages.length]);

  const handleSliderClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      e.preventDefault();
      return;
    }
    const currentSlideData = sliderImages[currentSlide];
    if (currentSlideData?.link) {
      window.location.href = currentSlideData.link;
    }
  }, [currentSlide, sliderImages]);

  if (loading && sliderImages.length === 0) {
    return <SkeletonLoader />;
  }

  if (sliderImages.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#191919] dark:bg-white">
      <div className="max-w-7xl mx-auto py-8 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Side - Main Slider */}
          <div className="lg:col-span-4 relative group">
            <div
              onClick={handleSliderClick}
              className="relative rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-800/50 cursor-pointer"
              style={{ height: settings.height }}
            >
              {sliderImages.map((image, index) => (
                <div
                  key={image._id || image.id || index}
                  className={`absolute inset-0 transition-transform duration-500 ease-out ${
                    index === currentSlide ? "translate-x-0" : "translate-x-full"
                  }`}
                  style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                >
                  {/* Lazy loaded image */}
                  {index === currentSlide || Math.abs(index - currentSlide) === 1 ? (
                    <img
                      src={image.url}
                      alt={image.alt || "Slider image"}
                      className="w-full h-full object-cover"
                      loading={index === currentSlide ? "eager" : "lazy"}
                      fetchPriority={index === currentSlide ? "high" : "low"}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/50" />
                </div>
              ))}

              {settings.showArrows && sliderImages.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Thumbnail Progress Indicators */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-4">
            {offers.map((offer, index) => (
              <div
                key={offer._id || offer.id || index}
                onClick={() => goToSlide(index)}
                className={`relative bg-[#28282c] dark:bg-white rounded-xl overflow-hidden transition-all duration-300 group cursor-pointer ${
                  index === currentSlide
                    ? "ring-2 ring-orange-500 dark:ring-orange-500 scale-[1.02]"
                    : "hover:scale-[1.01] hover:shadow-lg"
                }`}
              >
                {index === currentSlide && settings.autoplay && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600/30 dark:bg-gray-200/30 z-10">
                    <div
                      className="h-full bg-orange-500 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center p-0">
                  <div
                    className={`flex-shrink-0 w-24 h-[130px] ${offer.imageBg} rounded-[8px] flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden ${
                      index === currentSlide ? "scale-105" : ""
                    }`}
                  >
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full rounded-[8px] object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-xs font-semibold text-white dark:text-gray-600 uppercase tracking-wider font-lato">
                      {offer.title}
                    </h3>
                    <p className="text-sm font-light text-white dark:text-gray-400 mt-1 truncate">
                      {offer.description}
                    </p>
                    <Link
                      href={offer.linkUrl}
                      className="inline-block mt-2 text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {offer.linkText} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;