// components/BackToTopButton.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={`
        fixed bottom-8 right-8 z-50
        transition-all duration-300
        ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10 pointer-events-none'
        }
      `}
    >
      {/* Sonar Wave Rings - Outside the button */}
      <div className="relative flex items-center justify-center back-to-top">
        {/* Outer wave rings */}
        <div className="absolute rounded-full animate-sonar-wave-1" />
        <div className="absolute rounded-full animate-sonar-wave-2" />
        <div className="absolute rounded-full animate-sonar-wave-3" />
        
        {/* Button */}
        <button
          onClick={scrollToTop}
          className="relative p-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 z-10"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}