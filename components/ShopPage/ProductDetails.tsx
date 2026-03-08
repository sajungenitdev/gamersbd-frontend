"use client";
import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingCart,
  Shield,
  Truck,
  RefreshCw,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  Check,
  MapPin,
  Package,
  Clock,
  Award,
  Gamepad,
  Users,
  Globe,
  Headphones,
  Download,
  Maximize2,
  Minimize2,
  ThumbsUp,
  MessageCircle,
  AlertCircle,
  Sparkles,
  Gift,
  CreditCard,
  Zap
} from 'lucide-react';

// Sample product data
const productData = {
  id: 1,
  name: "Cyberpunk 2077",
  shortDescription: "Enter the dark future of Night City in this epic open-world RPG from CD Projekt Red.",
  fullDescription: `Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalomaniacal metropolis obsessed with power, glamour, and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality. You can customize your character's cyberware, skillset, and playstyle, and explore the vast city where the choices you make shape the story and the world around you.`,
  price: 59.99,
  originalPrice: 79.99,
  discount: 25,
  rating: 4.8,
  reviewCount: 2345,
  inStock: true,
  stockCount: 150,
  sku: "CP-2077-PC",
  category: "Action RPG",
  tags: ["Open World", "Sci-Fi", "RPG", "Single Player"],
  brand: "CD Projekt Red",
  releaseDate: "December 10, 2020",
  publisher: "CD Projekt",
  platform: ["PC", "PlayStation 5", "Xbox Series X", "PlayStation 4", "Xbox One"],
  languages: ["English", "French", "German", "Spanish", "Japanese", "Chinese"],
  features: [
    "Open World Night City",
    "Character Customization",
    "Multiple Endings",
    "Immersive Storyline",
    "Stunning Graphics",
    "Original Soundtrack"
  ],
  systemRequirements: {
    minimum: {
      os: "Windows 10 (64-bit)",
      processor: "Intel Core i5-3570K / AMD FX-8310",
      memory: "8 GB RAM",
      graphics: "NVIDIA GeForce GTX 780 / AMD Radeon RX 470",
      storage: "70 GB available space"
    },
    recommended: {
      os: "Windows 10 (64-bit)",
      processor: "Intel Core i7-4790 / AMD Ryzen 3 3200G",
      memory: "12 GB RAM",
      graphics: "NVIDIA GeForce GTX 1060 / AMD Radeon R9 390",
      storage: "70 GB available space"
    }
  },
  images: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542751110-97427fec2fd0?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop"
  ],
  videos: [
    {
      title: "Official Trailer",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop",
      url: "#"
    }
  ],
  reviews: [
    {
      id: 1,
      user: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
      rating: 5,
      date: "March 15, 2026",
      title: "Absolutely incredible!",
      content: "One of the best games I've ever played. The story is engaging, the graphics are stunning, and the gameplay is smooth. Highly recommended!",
      helpful: 245,
      verified: true
    },
    {
      id: 2,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108777-2961285e9489?w=100&auto=format&fit=crop",
      rating: 4,
      date: "March 10, 2026",
      title: "Great game but needs optimization",
      content: "The game is amazing but there are still some performance issues on PC. Hopefully they'll release more patches soon.",
      helpful: 189,
      verified: true
    },
    {
      id: 3,
      user: "Mike Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
      rating: 5,
      date: "March 5, 2026",
      title: "Worth every penny",
      content: "100+ hours and still finding new things. The world is so detailed and immersive. Must-play for RPG fans.",
      helpful: 312,
      verified: true
    }
  ],
  relatedProducts: [
    {
      id: 2,
      name: "The Witcher 3",
      image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=200&auto=format&fit=crop",
      price: 39.99,
      rating: 4.9
    },
    {
      id: 3,
      name: "Red Dead Redemption 2",
      image: "https://images.unsplash.com/photo-1542751110-97427fec2fd0?w=200&auto=format&fit=crop",
      price: 49.99,
      rating: 4.8
    },
    {
      id: 4,
      name: "Elden Ring",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&auto=format&fit=crop",
      price: 59.99,
      rating: 4.9
    },
    {
      id: 5,
      name: "God of War",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&auto=format&fit=crop",
      price: 49.99,
      rating: 4.8
    }
  ]
};

// Image Gallery Component
const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#1a1a1a] p-8' : ''}`}>
      {/* Main Image */}
      <div className="relative group">
        <div
          className={`relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          style={{
            height: isFullscreen ? 'calc(100vh - 200px)' : '400px'
          }}
        >
          <img
            src={images[currentImage]}
            alt="Product"
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                  }
                : {}
            }
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(!isFullscreen);
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              currentImage === index
                ? 'border-purple-500 opacity-100'
                : 'border-transparent opacity-50 hover:opacity-75'
            }`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// Product Info Component
const ProductInfo = ({ product }: { product: typeof productData }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(product.platform[0]);

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {product.rating} ({product.reviewCount} reviews)
          </span>
          {product.inStock ? (
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-white">${product.price}</span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-xl text-gray-500 line-through">
              ${product.originalPrice}
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
              Save {product.discount}%
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      <p className="text-gray-300 leading-relaxed">{product.shortDescription}</p>

      {/* Platform Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Platform</h3>
        <div className="flex flex-wrap gap-2">
          {product.platform.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedPlatform === platform
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-purple-500'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Quantity</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-[#1a1a1a] rounded-lg border border-gray-800 flex items-center justify-center hover:border-purple-500 transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-400" />
          </button>
          <span className="w-16 text-center text-white font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 bg-[#1a1a1a] rounded-lg border border-gray-800 flex items-center justify-center hover:border-purple-500 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          <span className="text-sm text-gray-500 ml-2">{product.stockCount} available</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group">
          <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Add to Cart
        </button>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="w-14 h-14 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-purple-500 transition-all group"
        >
          <Heart
            className={`w-6 h-6 mx-auto transition-all ${
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 group-hover:text-red-400'
            }`}
          />
        </button>
        <button className="w-14 h-14 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-purple-500 transition-all group">
          <Share2 className="w-6 h-6 text-gray-400 mx-auto group-hover:text-purple-400" />
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-gray-400">
          <Truck className="w-4 h-4 text-purple-400" />
          <span className="text-sm">Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <RefreshCw className="w-4 h-4 text-purple-400" />
          <span className="text-sm">30-Day Returns</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="text-sm">Secure Payment</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Headphones className="w-4 h-4 text-purple-400" />
          <span className="text-sm">24/7 Support</span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="space-y-2 text-sm border-t border-gray-800 pt-4">
        <div className="flex">
          <span className="w-24 text-gray-500">SKU:</span>
          <span className="text-gray-300">{product.sku}</span>
        </div>
        <div className="flex">
          <span className="w-24 text-gray-500">Category:</span>
          <span className="text-gray-300">{product.category}</span>
        </div>
        <div className="flex">
          <span className="w-24 text-gray-500">Brand:</span>
          <span className="text-gray-300">{product.brand}</span>
        </div>
        <div className="flex">
          <span className="w-24 text-gray-500">Release:</span>
          <span className="text-gray-300">{product.releaseDate}</span>
        </div>
        <div className="flex">
          <span className="w-24 text-gray-500">Tags:</span>
          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#1a1a1a] text-gray-400 text-xs rounded-full border border-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab Component
const Tab = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium transition-all relative ${
      isActive
        ? 'text-purple-400'
        : 'text-gray-400 hover:text-gray-300'
    }`}
  >
    {label}
    {isActive && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
    )}
  </button>
);

// Description Tab
const DescriptionTab = ({ product }: { product: typeof productData }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">About This Game</h3>
      <p className="text-gray-300 leading-relaxed">{product.fullDescription}</p>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
      <ul className="grid md:grid-cols-2 gap-3">
        {product.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Languages</h3>
      <div className="flex flex-wrap gap-2">
        {product.languages.map((lang) => (
          <span
            key={lang}
            className="px-3 py-1 bg-[#1a1a1a] text-gray-300 rounded-lg border border-gray-800"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Specifications Tab
const SpecificationsTab = ({ product }: { product: typeof productData }) => (
  <div className="space-y-6">
    {/* System Requirements */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">System Requirements</h3>
      
      {/* Minimum */}
      <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4 border border-gray-800">
        <h4 className="text-white font-medium mb-3">Minimum Requirements</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-24 text-gray-500">OS:</span>
            <span className="text-gray-300">{product.systemRequirements.minimum.os}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500">Processor:</span>
            <span className="text-gray-300">{product.systemRequirements.minimum.processor}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500">Memory:</span>
            <span className="text-gray-300">{product.systemRequirements.minimum.memory}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500">Graphics:</span>
            <span className="text-gray-300">{product.systemRequirements.minimum.graphics}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500">Storage:</span>
            <span className="text-gray-300">{product.systemRequirements.minimum.storage}</span>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-medium mb-3">Recommended Requirements</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-24 text-gray-500">OS:</span>
            <span className="text-gray-300">{product.systemRequirements.recommended.os}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500">Processor:</span>
            <span className="text-gray-300">{product.systemRequirements.recommended.processor}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500">Memory:</span>
            <span className="text-gray-300">{product.systemRequirements.recommended.memory}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500">Graphics:</span>
            <span className="text-gray-300">{product.systemRequirements.recommended.graphics}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500">Storage:</span>
            <span className="text-gray-300">{product.systemRequirements.recommended.storage}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Additional Info */}
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-medium mb-3">Game Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Publisher</span>
            <span className="text-gray-300">{product.publisher}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Developer</span>
            <span className="text-gray-300">{product.brand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Release Date</span>
            <span className="text-gray-300">{product.releaseDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Genre</span>
            <span className="text-gray-300">{product.category}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-medium mb-3">Additional Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Platforms</span>
            <span className="text-gray-300">{product.platform.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Languages</span>
            <span className="text-gray-300">{product.languages.length} languages</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Rating</span>
            <span className="text-gray-300">{product.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Reviews Tab
const ReviewsTab = ({ product }: { product: typeof productData }) => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">{product.rating}</div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">{product.reviewCount} reviews</p>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-gray-400 w-8">{star} star</span>
                <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${Math.random() * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{Math.floor(Math.random() * 1000)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', '5 star', '4 star', '3 star', '2 star', '1 star', 'with comments', 'with media'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-purple-600/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {product.reviews.map((review) => (
          <div key={review.id} className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.user}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-white font-medium">{review.user}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <h5 className="text-white font-medium mb-2">{review.title}</h5>
            <p className="text-gray-300 mb-4">{review.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Helpful ({review.helpful})</span>
              </button>
              <button className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review */}
      <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all">
        Write a Review
      </button>
    </div>
  );
};

// Related Products Component
const RelatedProducts = ({ products }: { products: typeof productData.relatedProducts }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {products.map((product) => (
      <a
        key={product.id}
        href={`/product/${product.id}`}
        className="group bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all"
      >
        <div className="relative h-40 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h4 className="text-white font-medium mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
            {product.name}
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-purple-400 font-bold">${product.price}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-400">{product.rating}</span>
            </div>
          </div>
        </div>
      </a>
    ))}
  </div>
);

// Main Component
const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Handle scroll for sticky bar
  React.useEffect(() => {
    const handleScroll = () => {
      setIsStickyBarVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm">
          <a href="/" className="text-gray-500 hover:text-purple-400 transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <a href="/shop" className="text-gray-500 hover:text-purple-400 transition-colors">Shop</a>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <a href={`/category/${productData.category.toLowerCase()}`} className="text-gray-500 hover:text-purple-400 transition-colors">
            {productData.category}
          </a>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-purple-400">{productData.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Gallery */}
          <ImageGallery images={productData.images} />

          {/* Right Column - Info */}
          <ProductInfo product={productData} />
        </div>

        {/* Tabs */}
        <div className="mt-12 border-b border-gray-800">
          <div className="flex overflow-x-auto">
            <Tab
              label="Description"
              isActive={activeTab === 'description'}
              onClick={() => setActiveTab('description')}
            />
            <Tab
              label="Specifications"
              isActive={activeTab === 'specifications'}
              onClick={() => setActiveTab('specifications')}
            />
            <Tab
              label="Reviews"
              isActive={activeTab === 'reviews'}
              onClick={() => setActiveTab('reviews')}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'description' && <DescriptionTab product={productData} />}
          {activeTab === 'specifications' && <SpecificationsTab product={productData} />}
          {activeTab === 'reviews' && <ReviewsTab product={productData} />}
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
          <RelatedProducts products={productData.relatedProducts} />
        </div>
      </div>

      {/* Sticky Add to Cart Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#2A2A2A] border-t border-gray-800 p-4 transform transition-transform duration-300 ${
          isStickyBarVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={productData.images[0]}
              alt={productData.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-white font-medium">{productData.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold">${productData.price}</span>
                {productData.originalPrice > productData.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${productData.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-[#1a1a1a] rounded-lg border border-gray-800 flex items-center justify-center hover:border-purple-500"
              >
                <Minus className="w-3 h-3 text-gray-400" />
              </button>
              <span className="w-12 text-center text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 bg-[#1a1a1a] rounded-lg border border-gray-800 flex items-center justify-center hover:border-purple-500"
              >
                <Plus className="w-3 h-3 text-gray-400" />
              </button>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;