"use client";
import React, { useState } from "react";
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Gift,
  AlertCircle,
  ChevronRight,
  PackageCheck,
  PackageOpen,
  PackageX,
  ArrowRight,
  Copy,
  Check,
  MessageCircle,
  Headphones,
  FileText,
  Download,
  Printer,
  Share2,
  Star,
  Heart,
  RefreshCw,
  Shield,
  Award,
  TruckIcon,
  Eye,
} from "lucide-react";

// Sample order data
const sampleOrder = {
  orderNumber: "GC-2026-12345",
  orderDate: "March 15, 2026",
  estimatedDelivery: "March 20, 2026",
  status: "shipped",
  paymentMethod: "Credit Card (VISA ending in 4242)",
  totalAmount: 299.97,
  shippingAddress: {
    name: "John Doe",
    street: "123 Gaming Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    country: "United States",
  },
  items: [
    {
      id: 1,
      name: "Cyberpunk 2077",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop",
      quantity: 1,
      price: 59.99,
      category: "Game",
    },
    {
      id: 2,
      name: "PlayStation 5 Controller",
      image:
        "https://images.unsplash.com/photo-1600083469459-8e4c5e1b1f5a?w=200&auto=format&fit=crop",
      quantity: 2,
      price: 69.99,
      category: "Accessory",
    },
    {
      id: 3,
      name: "Gaming Headset",
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&auto=format&fit=crop",
      quantity: 1,
      price: 99.99,
      category: "Accessory",
    },
  ],
  timeline: [
    {
      status: "Order Placed",
      date: "Mar 15, 2026",
      time: "10:30 AM",
      description: "Your order has been placed successfully",
      completed: true,
      icon: Package,
    },
    {
      status: "Order Confirmed",
      date: "Mar 15, 2026",
      time: "11:45 AM",
      description: "Your order has been confirmed and is being processed",
      completed: true,
      icon: CheckCircle,
    },
    {
      status: "Processing",
      date: "Mar 16, 2026",
      time: "09:20 AM",
      description: "Your items are being packed",
      completed: true,
      icon: PackageOpen,
    },
    {
      status: "Shipped",
      date: "Mar 17, 2026",
      time: "02:15 PM",
      description: "Your order has been shipped via FastExpress",
      completed: true,
      icon: Truck,
    },
    {
      status: "Out for Delivery",
      date: "Mar 19, 2026",
      time: "08:30 AM",
      description: "Your package is out for delivery",
      completed: false,
      icon: PackageCheck,
    },
    {
      status: "Delivered",
      date: "Mar 20, 2026",
      time: "Expected",
      description: "Your package will be delivered today",
      completed: false,
      icon: CheckCircle,
    },
  ],
  trackingNumber: "1Z999AA10123456784",
  carrier: "FastExpress",
  carrierUrl: "#",
};

// Order Status Component
const OrderStatus = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-500", text: "Pending", icon: Clock },
    confirmed: { color: "bg-blue-500", text: "Confirmed", icon: CheckCircle },
    processing: {
      color: "bg-purple-500",
      text: "Processing",
      icon: PackageOpen,
    },
    shipped: { color: "bg-indigo-500", text: "Shipped", icon: Truck },
    delivered: { color: "bg-green-500", text: "Delivered", icon: CheckCircle },
    cancelled: { color: "bg-red-500", text: "Cancelled", icon: PackageX },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-12 h-12 rounded-full bg-indigo-400 bg-opacity-20 flex items-center justify-center`}
      >
        <TruckIcon className={`w-6 h-6 text-white`} />
      </div>
      <div>
        <p className="text-sm text-gray-400">Current Status</p>
        <p
          className={`text-2xl text-white font-bold ${config.color.replace("bg-", "text-")}`}
        >
          {config.text}
        </p>
      </div>
    </div>
  );
};

// Timeline Component
const Timeline = ({ timeline }: { timeline: any[] }) => {
  return (
    <div className="relative">
      {timeline.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Line Connector */}
            {index < timeline.length - 1 && (
              <div
                className={`absolute left-5 top-8 w-0.5 h-full ${
                  item.completed ? "bg-green-500/30" : "bg-gray-700"
                }`}
              ></div>
            )}

            {/* Icon */}
            <div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                item.completed
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-800 text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h4
                  className={`font-semibold ${
                    item.completed ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.status}
                </h4>
                <span className="text-sm text-gray-500">
                  {item.date} at {item.time}
                </span>
                {item.completed && (
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Order Item Component
const OrderItem = ({ item }: { item: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group flex items-center gap-4 py-4 border-b border-gray-800 last:border-0 hover:bg-white/5 transition-colors px-4 rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">
              {item.name}
            </h4>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold">${item.price}</p>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
          title="Write Review"
        >
          <Star className="w-4 h-4 text-gray-400 hover:text-purple-400" />
        </button>
        <button
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-400" />
        </button>
        <button
          className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
          title="Buy Again"
        >
          <RefreshCw className="w-4 h-4 text-gray-400 hover:text-blue-400" />
        </button>
      </div>
    </div>
  );
};

// Track Order Form Component
const TrackOrderForm = ({
  onTrack,
}: {
  onTrack: (orderNumber: string, email: string) => void;
}) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ orderNumber: "", email: "" });

  const validate = () => {
    const newErrors = { orderNumber: "", email: "" };
    let isValid = true;

    if (!orderNumber.trim()) {
      newErrors.orderNumber = "Order number is required";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onTrack(orderNumber, email);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#2A2A2A] rounded-2xl p-8 border border-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Track Your Order</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Order Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g., GC-2026-12345"
            className={`w-full px-4 py-3 bg-[#1a1a1a] border ${
              errors.orderNumber ? "border-red-500" : "border-gray-700"
            } rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white placeholder-gray-500 transition-colors`}
          />
          {errors.orderNumber && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.orderNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className={`w-full px-4 py-3 bg-[#1a1a1a] border ${
              errors.email ? "border-red-500" : "border-gray-700"
            } rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white placeholder-gray-500 transition-colors`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
        >
          <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Track Order
        </button>

        <p className="text-sm text-gray-500 text-center">
          You can also track your order without an account using the order
          number and email.
        </p>
      </div>
    </form>
  );
};

// Order Details Component
const OrderDetails = ({
  order,
  onBack,
}: {
  order: typeof sampleOrder;
  onBack: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          Track Another Order
        </button>
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
            title="Print"
          >
            <Printer className="w-5 h-5 text-gray-400 hover:text-purple-400" />
          </button>
          <button
            className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5 text-gray-400 hover:text-purple-400" />
          </button>
          <button
            className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5 text-gray-400 hover:text-purple-400" />
          </button>
        </div>
      </div>

      {/* Order Status Banner */}
      <div className="bg-gradient-to-br from-purple-600/10 via-indigo-600/10 to-purple-600/10 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <OrderStatus status={order.status} />
          <div className="text-right">
            <p className="text-sm text-gray-400">Order Total</p>
            <p className="text-3xl font-bold text-white">
              ${order.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-4">
        {["timeline", "items", "details"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "timeline" && (
          <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">
              Order Timeline
            </h3>
            <Timeline timeline={order.timeline} />
          </div>
        )}

        {activeTab === "items" && (
          <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Order Items</h3>
              <p className="text-sm text-gray-400">
                {order.items.length} items
              </p>
            </div>
            <div className="divide-y divide-gray-800">
              {order.items.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Order Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Order Number</p>
                    <p className="text-white font-medium">
                      {order.orderNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Order Date</p>
                    <p className="text-white font-medium">{order.orderDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Payment Method</p>
                    <p className="text-white font-medium">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Estimated Delivery</p>
                    <p className="text-white font-medium">
                      {order.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Shipping Address
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-medium">
                      {order.shippingAddress.name}
                    </p>
                    <p className="text-gray-400">
                      {order.shippingAddress.street}
                    </p>
                    <p className="text-gray-400">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-400">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            <div className="md:col-span-2 bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Tracking Information
              </h3>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Truck className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Carrier</p>
                    <p className="text-white font-medium">{order.carrier}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Tracking Number</p>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-2 bg-[#1a1a1a] rounded-lg text-purple-400 font-mono">
                      {order.trackingNumber}
                    </code>
                    <button
                      onClick={() => copyToClipboard(order.trackingNumber)}
                      className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors relative"
                      title="Copy tracking number"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                      )}
                    </button>
                  </div>
                </div>
                <a
                  href={order.carrierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Track on Carrier Site
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Need Help Section */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">
          Need Help With Your Order?
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="#"
            className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl hover:border-purple-500/50 border border-gray-800 transition-all group"
          >
            <Headphones className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-white font-medium">Contact Support</p>
              <p className="text-sm text-gray-400">24/7 customer service</p>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl hover:border-purple-500/50 border border-gray-800 transition-all group"
          >
            <MessageCircle className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-white font-medium">Live Chat</p>
              <p className="text-sm text-gray-400">Instant messaging</p>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl hover:border-purple-500/50 border border-gray-800 transition-all group"
          >
            <FileText className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-white font-medium">Return Policy</p>
              <p className="text-sm text-gray-400">30-day returns</p>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl hover:border-purple-500/50 border border-gray-800 transition-all group"
          >
            <Shield className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-white font-medium">Warranty Info</p>
              <p className="text-sm text-gray-400">1-year warranty</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

// Main Component
const TrackOrder = () => {
  const [orderData, setOrderData] = useState<typeof sampleOrder | null>(null);
  const [recentOrders] = useState([
    { number: "GC-2026-12345", date: "Mar 15, 2026", total: "$299.97" },
    { number: "GC-2026-12340", date: "Mar 10, 2026", total: "$159.98" },
    { number: "GC-2026-12338", date: "Mar 5, 2026", total: "$89.99" },
  ]);

  const handleTrack = (orderNumber: string, email: string) => {
    // In a real app, you would fetch the order data from an API
    console.log("Tracking:", { orderNumber, email });
    setOrderData(sampleOrder);
  };

  return (
    <div className=" bg-[#1a1a1a]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!orderData ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Track Order Form */}
            <div className="lg:col-span-2">
              <TrackOrderForm onTrack={handleTrack} />
            </div>

            {/* Recent Orders & Help */}
            <div className="space-y-6">
              {/* Trust Badge */}
              <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Secure Tracking</p>
                    <p className="text-sm text-gray-400">
                      Your data is protected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">100% Guaranteed</p>
                    <p className="text-sm text-gray-400">
                      Satisfaction guaranteed
                    </p>
                  </div>
                </div>
              </div>
              {/* Recent Orders */}
              <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Orders
                </h3>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <button
                      key={order.number}
                      onClick={() => setOrderData(sampleOrder)}
                      className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl hover:border-purple-500/50 border border-gray-800 transition-all group"
                    >
                      <div className="text-left">
                        <p className="text-white font-medium group-hover:text-purple-400 transition-colors">
                          {order.number}
                        </p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-medium">
                          {order.total}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <OrderDetails order={orderData} onBack={() => setOrderData(null)} />
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
