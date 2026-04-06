"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Headphones,
  BookOpen,
  Users,
  CreditCard,
  Truck,
  Package,
  RefreshCw,
  Shield,
  Gamepad,
  Clock,
  Sparkles,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { faqService, FAQ, Category } from "../../services/faq.service";

// FAQ Item Component
const FAQItem = ({
  faq,
  isOpen,
  onToggle,
  onHelpful,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  onHelpful: (id: string, helpful: boolean) => Promise<void>;
}) => {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleHelpful = async (value: boolean) => {
    if (submitting) return;
    setSubmitting(true);
    setHelpful(value);
    await onHelpful(faq._id, value);
    setSubmitting(false);
  };

  return (
    <div className="bg-[#2A2A2A] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left group"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors pr-8">
            {faq.question}
          </h3>
          {faq.popular && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
              <Sparkles className="w-3 h-3" />
              Popular
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4">
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
              {faq.answer}
            </p>

            {/* Related Links */}
            {faq.related && faq.related.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Related Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {faq.related.map((related) => (
                    <button
                      key={related._id}
                      className="text-sm text-purple-400 hover:text-purple-300 underline decoration-purple-500/30 hover:decoration-purple-500 transition-all"
                    >
                      {related.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Helpful Section */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <p className="text-sm text-gray-400">Was this helpful?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleHelpful(true)}
                  disabled={submitting}
                  className={`p-2 rounded-lg transition-all ${
                    helpful === true
                      ? "bg-green-500/20 text-green-400"
                      : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleHelpful(false)}
                  disabled={submitting}
                  className={`p-2 rounded-lg transition-all ${
                    helpful === false
                      ? "bg-red-500/20 text-red-400"
                      : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({
  category,
  selected,
  onClick,
  count,
}: {
  category: { id: string; name: string; icon: any };
  selected: boolean;
  onClick: () => void;
  count: number;
}) => {
  const Icon = category.icon;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 w-full ${
        selected
          ? "bg-purple-600 border-purple-500 text-white"
          : "bg-[#2A2A2A] border-gray-800 text-gray-400 hover:border-purple-500/50 hover:text-purple-400"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium flex-1 text-left">{category.name}</span>
      <span
        className={`text-sm px-2 py-1 rounded-full ${
          selected ? "bg-white/20 text-white" : "bg-[#1a1a1a] text-gray-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
};

// Search Component
const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search for answers..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full pl-12 pr-4 py-4 bg-[#2A2A2A] text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-500"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          ×
        </button>
      )}
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ icon: Icon, title, description, action, link }: any) => (
  <a
    href={link}
    className="group bg-[#2A2A2A] rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
        <span className="inline-flex items-center gap-1 text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">
          {action}
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </a>
);

// Quick Help Component
const QuickHelp = () => (
  <div className="bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl p-8 border border-purple-500/30 relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Still have questions?</h3>
      </div>
      <p className="text-gray-300 mb-6">
        Can't find what you're looking for? Our support team is here to help
        24/7.
      </p>
      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105">
        Contact Support
      </button>
    </div>
  </div>
);

// Popular Topics Component
const PopularTopics = () => {
  const topics = [
    { icon: Truck, label: "Shipping Info" },
    { icon: RefreshCw, label: "Returns" },
    { icon: CreditCard, label: "Payments" },
    { icon: Gamepad, label: "Digital Games" },
    { icon: Users, label: "Account" },
    { icon: Shield, label: "Security" },
  ];

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Popular Topics</h3>
      <div className="grid grid-cols-2 gap-3">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.label}
              className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-xl hover:border-purple-500/50 border border-gray-800 transition-all group"
            >
              <Icon className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {topic.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Main Component
const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const categoryConfig = [
    { id: "all", name: "All Questions", icon: HelpCircle },
    { id: "orders", name: "Orders & Shipping", icon: Package },
    { id: "payment", name: "Payment & Billing", icon: CreditCard },
    { id: "returns", name: "Returns & Refunds", icon: RefreshCw },
    { id: "account", name: "Account Management", icon: Users },
    { id: "games", name: "Games & Digital", icon: Gamepad },
    { id: "technical", name: "Technical Support", icon: Headphones },
  ];

  const fetchFAQs = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const { data, categories: catData } = await faqService.getAllFAQs(params, abortController.signal);
      setFaqs(data);
      setCategories(catData);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Silently ignore abort errors
        return;
      }
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  // Debounced fetch
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchFAQs();
    }, 500);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchFAQs]);

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) =>
      prev.includes(id) ? prev.filter((faqId) => faqId !== id) : [...prev, id]
    );
  };

  const handleHelpful = async (id: string, helpful: boolean) => {
    try {
      await faqService.markHelpful(id, helpful);
    } catch (error) {
      console.error("Error marking helpful:", error);
    }
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return faqs.length;
    const cat = categories.find((c) => c._id === categoryId);
    return cat?.count || 0;
  };

  const popularFaqs = faqs.filter((faq) => faq.popular);

  if (loading && faqs.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1f1f1f] to-[#1a1a1a] py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Help Center
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Find answers to common questions about orders, payments, returns,
              and more.
            </p>

            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={setSearchQuery} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categoryConfig.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      selected={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      count={getCategoryCount(category.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Popular Topics */}
              <PopularTopics />

              {/* Quick Stats */}
              <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Response Time
                  </h3>
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Live Chat</p>
                    <p className="text-white font-medium">&lt; 2 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Support</p>
                    <p className="text-white font-medium">&lt; 4 hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone Support</p>
                    <p className="text-white font-medium">&lt; 5 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Popular FAQs Section */}
            {!searchQuery && selectedCategory === "all" && popularFaqs.length > 0 && (
              <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">
                    Popular Questions
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {popularFaqs.slice(0, 6).map((faq) => (
                    <button
                      key={faq._id}
                      onClick={() => {
                        toggleFaq(faq._id);
                        document
                          .getElementById(`faq-${faq._id}`)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                      }}
                      className="text-left p-4 bg-[#1a1a1a] rounded-xl hover:border-purple-500/50 border border-gray-800 transition-all group"
                    >
                      <p className="text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                        {faq.question}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ List */}
            <div className="space-y-4">
              {faqs.length > 0 ? (
                faqs.map((faq) => (
                  <div key={faq._id} id={`faq-${faq._id}`}>
                    <FAQItem
                      faq={faq}
                      isOpen={openFaqs.includes(faq._id)}
                      onToggle={() => toggleFaq(faq._id)}
                      onHelpful={handleHelpful}
                    />
                  </div>
                ))
              ) : (
                <div className="bg-[#2A2A2A] rounded-2xl p-12 text-center border border-gray-800">
                  <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Try different keywords or browse categories
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Contact Options */}
            <div className="grid md:grid-cols-3 gap-4">
              <ContactCard
                icon={MessageCircle}
                title="Live Chat"
                description="Chat with our support team"
                action="Start Chat"
                link="#"
              />
              <ContactCard
                icon={Mail}
                title="Email Support"
                description="Get a reply within 4 hours"
                action="Send Email"
                link="mailto:support@gamechangers.com"
              />
              <ContactCard
                icon={Phone}
                title="Phone Support"
                description="Speak with a representative"
                action="Call Now"
                link="tel:+18001234567"
              />
            </div>

            {/* Quick Help Section */}
            <QuickHelp />
          </div>
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1f1f1f] rounded-3xl p-12 border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you with any
              questions or concerns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                <Headphones className="w-5 h-5" />
                Contact Support
              </button>
              <button className="px-8 py-4 border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                Browse Guides
              </button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4 mt-8">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center hover:bg-purple-600 transition-all duration-300 hover:scale-110 border border-gray-800"
                >
                  <Icon className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;