// app/order-confirmation/[orderId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Printer,
  Mail,
  Download,
  ArrowLeft,
  Loader2,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useOrder } from "../../contexts/OrderContext";
import { useUserAuth } from "../../contexts/UserAuthContext";
import { toast } from "react-hot-toast";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrderById, currentOrder, isLoading } = useOrder();
  const { user } = useUserAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get orderId from params - works for both [orderId] and [id]
  const orderId = params?.orderId || params?.id;

  useEffect(() => {
    if (!user) {
      router.push(`/auth?redirect=/order-confirmation/${orderId}`);
      return;
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId, user]);

  const loadOrder = async () => {
    try {
      setError(null);
      const order = await getOrderById(orderId as string);
      if (!order) {
        setError("Order not found");
        toast.error("Order not found");
      }
    } catch (err) {
      console.error("Failed to load order:", err);
      setError("Failed to load order details");
      toast.error("Failed to load order details");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      // Implement invoice download logic here
      // You'll need to add this to your OrderContext
      toast.success("Invoice download started");
    } catch (error) {
      toast.error("Failed to download invoice");
    } finally {
      setIsDownloading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            {error ||
              "We couldn't find your order. Please check your order number and try again."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <Package className="w-5 h-5" />
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-400 bg-yellow-400/10",
      confirmed: "text-blue-400 bg-blue-400/10",
      processing: "text-purple-400 bg-purple-400/10",
      shipped: "text-indigo-400 bg-indigo-400/10",
      in_transit: "text-cyan-400 bg-cyan-400/10",
      out_for_delivery: "text-orange-400 bg-orange-400/10",
      delivered: "text-green-400 bg-green-400/10",
      cancelled: "text-red-400 bg-red-400/10",
      refunded: "text-gray-400 bg-gray-400/10",
      on_hold: "text-yellow-400 bg-yellow-400/10",
    };
    return colors[status] || "text-gray-400 bg-gray-400/10";
  };

  const getStatusText = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-400">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Order ID: {currentOrder.orderNumber || currentOrder._id}
          </p>
        </div>

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Order Number</p>
                <p className="text-white font-semibold">
                  {currentOrder.orderNumber || currentOrder._id.slice(-8)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Placed On</p>
                <p className="text-white font-semibold">
                  {new Date(
                    currentOrder.placedAt || currentOrder.createdAt,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Payment Method</p>
                <p className="text-white font-semibold capitalize">
                  {currentOrder.payment?.method?.replace(/_/g, " ") ||
                    "Cash on Delivery"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentOrder.status)}`}
              >
                {getStatusText(currentOrder.status)}
              </div>
              <div>
                <p className="text-sm text-gray-400">Order Status</p>
                <p className="text-white font-semibold">
                  {getStatusText(currentOrder.status)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-[#2A2A2A] rounded-xl overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {currentOrder.items?.map((item, index) => (
              <div key={item._id || index} className="p-6 flex gap-4">
                <img
                  src={item.product?.images?.[0] || "/placeholder.png"}
                  alt={item.product?.name || "Product"}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <Link
                    href={`/product/${item.product?.slug || item.product?._id}`}
                  >
                    <h3 className="text-white font-semibold hover:text-purple-400 transition">
                      {item.product?.name || "Product"}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-sm mt-1">
                    Quantity: {item.quantity} ×{" "}
                    {formatCurrency(item.priceAtTime)}
                  </p>
                  {item.platform && (
                    <p className="text-gray-500 text-xs mt-1">
                      Platform: {item.platform}
                    </p>
                  )}
                </div>
                <p className="text-purple-400 font-semibold">
                  {formatCurrency(item.priceAtTime * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Price Breakdown</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>{formatCurrency(currentOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>
                {currentOrder.shippingCost === 0
                  ? "Free"
                  : formatCurrency(currentOrder.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax (10%)</span>
              <span>{formatCurrency(currentOrder.tax)}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>-{formatCurrency(currentOrder.discount)}</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span className="text-purple-400">
                  {formatCurrency(currentOrder.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Billing Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Shipping Address</h2>
            </div>
            <div className="space-y-1 text-gray-300">
              <p className="font-medium">
                {currentOrder.shippingAddress?.fullName || "N/A"}
              </p>
              <p>{currentOrder.shippingAddress?.addressLine1 || "N/A"}</p>
              {currentOrder.shippingAddress?.addressLine2 && (
                <p>{currentOrder.shippingAddress.addressLine2}</p>
              )}
              <p>
                {currentOrder.shippingAddress?.city || "N/A"},{" "}
                {currentOrder.shippingAddress?.state || "N/A"}
              </p>
              <p>
                {currentOrder.shippingAddress?.postalCode || "N/A"},{" "}
                {currentOrder.shippingAddress?.country || "N/A"}
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4" />
                {currentOrder.shippingAddress?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Billing Address</h2>
            </div>
            <div className="space-y-1 text-gray-300">
              <p className="font-medium">
                {currentOrder.billingAddress?.fullName || "N/A"}
              </p>
              <p>{currentOrder.billingAddress?.addressLine1 || "N/A"}</p>
              {currentOrder.billingAddress?.addressLine2 && (
                <p>{currentOrder.billingAddress.addressLine2}</p>
              )}
              <p>
                {currentOrder.billingAddress?.city || "N/A"},{" "}
                {currentOrder.billingAddress?.state || "N/A"}
              </p>
              <p>
                {currentOrder.billingAddress?.postalCode || "N/A"},{" "}
                {currentOrder.billingAddress?.country || "N/A"}
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4" />
                {currentOrder.billingAddress?.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        {currentOrder.notes && (
          <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-2">Order Notes</h2>
            <p className="text-gray-400">{currentOrder.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/dashboard/orders"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            View All Orders
          </Link>

          {/* <button
            onClick={handlePrint}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button> */}

          {/* <button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Invoice
          </button> */}

          <Link
            href="/shop"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Email Confirmation Message */}
        <div className="text-center mt-8 p-4 bg-blue-500/10 rounded-lg">
          <Mail className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            A confirmation email has been sent to{" "}
            <span className="text-white">{user?.email}</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            You can track your order status in your dashboard
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          button,
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
