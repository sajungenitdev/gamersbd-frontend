"use client";
import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Headphones,
  FileText,
  BookOpen,
  Video,
  Users,
  CreditCard,
  Truck,
  Package,
  RefreshCw,
  Shield,
  Gift,
  Gamepad,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageSquare,
} from "lucide-react";

// FAQ Categories
const categories = [
  { id: "all", name: "All Questions", icon: HelpCircle, count: 24 },
  { id: "orders", name: "Orders & Shipping", icon: Package, count: 6 },
  { id: "payment", name: "Payment & Billing", icon: CreditCard, count: 4 },
  { id: "returns", name: "Returns & Refunds", icon: RefreshCw, count: 3 },
  { id: "account", name: "Account Management", icon: Users, count: 4 },
  { id: "games", name: "Games & Digital", icon: Gamepad, count: 4 },
  { id: "technical", name: "Technical Support", icon: Headphones, count: 3 },
];

// FAQ Data
const faqs = [
  {
    id: 1,
    question: "How do I track my order?",
    answer:
      "You can track your order by logging into your account and visiting the 'Order History' section. Alternatively, use our Track Order page with your order number and email address. You'll receive real-time updates on your package location and estimated delivery time.",
    category: "orders",
    popular: true,
    related: [2, 3, 5],
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and various regional payment methods. All transactions are securely processed and encrypted.",
    category: "payment",
    popular: true,
    related: [1, 4, 6],
  },
  {
    id: 3,
    question: "How long does shipping take?",
    answer:
      "Shipping times vary by location: Standard shipping (3-5 business days), Express shipping (1-2 business days), and International shipping (7-14 business days). Free standard shipping is available on orders over $50.",
    category: "orders",
    popular: true,
    related: [1, 5, 8],
  },
  {
    id: 4,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be unused and in original packaging. Digital downloads and gift cards are non-refundable. Visit our Returns Center to initiate a return.",
    category: "returns",
    popular: true,
    related: [2, 3, 7],
  },
  {
    id: 5,
    question: "How do I download purchased games?",
    answer:
      "After purchase, games appear in your Library. You can download them directly through our desktop app or website. Most games can be downloaded up to 5 times on different devices.",
    category: "games",
    popular: false,
    related: [1, 8, 9],
  },
  {
    id: 6,
    question: "Can I change my order after placing it?",
    answer:
      "Orders can be modified within 1 hour of placement. Contact customer support immediately with your order number for changes to shipping address or items. After 1 hour, orders are processed and cannot be modified.",
    category: "orders",
    popular: false,
    related: [1, 3, 7],
  },
  {
    id: 7,
    question: "How do I reset my password?",
    answer:
      "Click 'Forgot Password' on the login page and enter your email. You'll receive a reset link within minutes. For security, links expire after 24 hours. Contact support if you don't receive the email.",
    category: "account",
    popular: true,
    related: [4, 6, 10],
  },
  {
    id: 8,
    question: "Do you offer gift cards?",
    answer:
      "Yes! Digital gift cards are available in denominations from $10 to $500. They're delivered via email within minutes and never expire. Physical gift cards are also available for purchase.",
    category: "payment",
    popular: false,
    related: [2, 4, 9],
  },
  {
    id: 9,
    question: "What regions do you ship to?",
    answer:
      "We ship to over 50 countries worldwide. Enter your address at checkout to confirm availability. Some regions may have additional shipping fees or customs duties.",
    category: "orders",
    popular: false,
    related: [1, 3, 5],
  },
  {
    id: 10,
    question: "How do I contact customer support?",
    answer:
      "Our support team is available 24/7 via live chat, email at support@gamechangers.com, or phone at +1 (800) 123-4567. Average response time is under 2 hours for email.",
    category: "technical",
    popular: true,
    related: [2, 4, 7],
  },
  {
    id: 11,
    question: "Are my payment details secure?",
    answer:
      "Absolutely! We use 256-bit SSL encryption and are PCI-DSS compliant. Your payment information is never stored on our servers and is processed through certified payment gateways.",
    category: "payment",
    popular: true,
    related: [2, 4, 6],
  },
  {
    id: 12,
    question: "Can I play games on multiple devices?",
    answer:
      "Yes! Your game library syncs across all devices. Download our app on Windows, Mac, iOS, and Android to access your games anywhere. Progress syncs automatically via cloud saves.",
    category: "games",
    popular: false,
    related: [5, 8, 9],
  },
];

// FAQ Item Component
const FAQItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: any;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const [helpful, setHelpful] = useState<boolean | null>(null);

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
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4">
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-300 leading-relaxed mb-4">{faq.answer}</p>

            {/* Related Links */}
            {faq.related && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Related Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {faq.related.map((id: number) => {
                    const related = faqs.find((f) => f.id === id);
                    return related ? (
                      <button
                        key={id}
                        className="text-sm text-purple-400 hover:text-purple-300 underline decoration-purple-500/30 hover:decoration-purple-500 transition-all"
                      >
                        {related.question}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Helpful Section */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <p className="text-sm text-gray-400">Was this helpful?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setHelpful(true)}
                  className={`p-2 rounded-lg transition-all ${
                    helpful === true
                      ? "bg-green-500/20 text-green-400"
                      : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setHelpful(false)}
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
}: {
  category: any;
  selected: boolean;
  onClick: () => void;
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
        {category.count}
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
    {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div> */}

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
    { icon: Truck, label: "Shipping Info", count: 12 },
    { icon: RefreshCw, label: "Returns", count: 8 },
    { icon: CreditCard, label: "Payments", count: 15 },
    { icon: Gamepad, label: "Digital Games", count: 10 },
    { icon: Users, label: "Account", count: 7 },
    { icon: Shield, label: "Security", count: 5 },
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleFaq = (id: number) => {
    setOpenFaqs((prev) =>
      prev.includes(id) ? prev.filter((faqId) => faqId !== id) : [...prev, id],
    );
  };

  // Filter FAQs
  const filteredFaqs = faqs.filter((faq) => {
    if (selectedCategory !== "all" && faq.category !== selectedCategory)
      return false;
    if (searchQuery) {
      return (
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  // Get popular FAQs
  const popularFaqs = faqs.filter((faq) => faq.popular);

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

            {/* Search Bar */}
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
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      selected={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
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
            {/* Popular FAQs Section (shown when no search) */}
            {!searchQuery && selectedCategory === "all" && (
              <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">
                    Popular Questions
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {popularFaqs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => {
                        toggleFaq(faq.id);
                        document
                          .getElementById(`faq-${faq.id}`)
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
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} id={`faq-${faq.id}`}>
                    <FAQItem
                      faq={faq}
                      isOpen={openFaqs.includes(faq.id)}
                      onToggle={() => toggleFaq(faq.id)}
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
