// app/checkout/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Loader2,
  Banknote,
  Smartphone,
  CreditCard as CardIcon,
  DollarSign,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Phone,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useOrder } from "../contexts/OrderContext";
import { useUserAuth } from "../contexts/UserAuthContext";
import { toast } from "react-hot-toast";

// Currency configuration
const EXCHANGE_RATE = 110;

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 / EXCHANGE_RATE },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    clearCart,
    isLoading: cartLoading,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { createOrder, isLoading: orderLoading } = useOrder();
  const { user, token } = useUserAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0],
  );
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    | "bkash"
    | "nagad"
    | "rocket"
    | "credit_card"
    | "debit_card"
    | "cash_on_delivery"
  >("cash_on_delivery");
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: "",
    mobileNumber: "",
  });

  const [useBillingSameAsShipping, setUseBillingSameAsShipping] =
    useState(true);
  const [billingAddress, setBillingAddress] = useState({ ...shippingAddress });
  const [notes, setNotes] = useState("");

  // Check if user is logged in
  useEffect(() => {
    if (!user && !cartLoading) {
      toast.error("Please login to checkout");
      router.push("/auth?redirect=/checkout");
    }
  }, [user, cartLoading, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      toast.success("Your cart is empty");
      //   router.push("/cart");
    }
  }, [items, cartLoading, router]);

  // Convert price based on selected currency
  const convertPrice = (priceInBDT: number) => {
    if (selectedCurrency.code === "BDT") {
      return priceInBDT;
    }
    return priceInBDT * selectedCurrency.rate;
  };

  // Format price with currency symbol
  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
  };

  // Calculate totals with conversion
  const subtotalInBDT = subtotal;
  const shippingCostInBDT = subtotalInBDT > 10000 ? 0 : 100;
  const taxInBDT = subtotalInBDT * 0.1;
  const totalInBDT = subtotalInBDT + shippingCostInBDT + taxInBDT;

  // Save currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem("preferredCurrency");
    if (savedCurrency) {
      const currency = currencies.find((c) => c.code === savedCurrency);
      if (currency) setSelectedCurrency(currency);
    }
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem("preferredCurrency", currency.code);
    setShowCurrencyDropdown(false);
    toast.success(`Currency changed to ${currency.code}`);
  };

  // Handle quantity update
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdatingItemId(itemId);
    const success = await updateQuantity(itemId, newQuantity);
    setUpdatingItemId(null);

    if (success) {
      toast.success("Quantity updated");
    } else {
      toast.error("Failed to update quantity");
    }
  };

  // Handle remove item
  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItemId(itemId);
    const success = await removeFromCart(itemId);
    setUpdatingItemId(null);

    if (success) {
      toast.success("Item removed from cart");
    } else {
      toast.error("Failed to remove item");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (useBillingSameAsShipping) {
      setBillingAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBillingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingAddress = () => {
    if (!shippingAddress.fullName) return "Full name is required";
    if (!shippingAddress.addressLine1) return "Address is required";
    if (!shippingAddress.city) return "City is required";
    if (!shippingAddress.state) return "State is required";
    if (!shippingAddress.postalCode) return "Postal code is required";
    if (!shippingAddress.country) return "Country is required";
    if (!shippingAddress.phone) return "Phone number is required";
    return null;
  };

  const validatePayment = () => {
    if (paymentMethod === "cash_on_delivery") return null;

    const onlineMethods = ["bkash", "nagad", "rocket"];
    if (onlineMethods.includes(paymentMethod)) {
      if (!paymentDetails.transactionId) return "Transaction ID is required";
      if (!paymentDetails.mobileNumber) return "Mobile number is required";
    }

    return null;
  };

  const handlePlaceOrder = async () => {
    // Check if user is logged in
    if (!user || !token) {
      toast.error("Please login to place order");
      router.push("/auth?redirect=/checkout");
      return;
    }

    // Validate shipping address
    const addressError = validateShippingAddress();
    if (addressError) {
      toast.error(addressError);
      return;
    }

    // Validate payment
    const paymentError = validatePayment();
    if (paymentError) {
      toast.error(paymentError);
      return;
    }

    setIsSubmitting(true);

    // Prepare cart items for order
    const orderItems = items.map((item) => ({
      product: item._id as string,
      quantity: item.quantity,
      platform: item.platform || "PC",
      priceAtTime: item.price,
    }));

    // Prepare order data according to your backend schema
    const orderData = {
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      },
      billingAddress: useBillingSameAsShipping
        ? {
            fullName: shippingAddress.fullName,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2 || "",
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          }
        : {
            fullName: billingAddress.fullName,
            addressLine1: billingAddress.addressLine1,
            addressLine2: billingAddress.addressLine2 || "",
            city: billingAddress.city,
            state: billingAddress.state,
            postalCode: billingAddress.postalCode,
            country: billingAddress.country,
            phone: billingAddress.phone,
          },
      payment: {
        method: paymentMethod,
        transactionId: paymentDetails.transactionId || undefined,
        mobileNumber: paymentDetails.mobileNumber || undefined,
        amount: totalInBDT,
        currency: "BDT",
      },
      notes: notes || undefined,
    };

    console.log("Submitting order:", orderData);

    const order = await createOrder(orderData);

    if (order) {
      // Clear cart
      await clearCart();

      // Redirect to order confirmation
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation/${order._id}`);
    }

    setIsSubmitting(false);
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const paymentMethods = [
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when you receive the order",
    },
    {
      id: "bkash",
      name: "bKash",
      icon: Smartphone,
      description: "Pay with bKash mobile banking",
    },
    {
      id: "nagad",
      name: "Nagad",
      icon: Smartphone,
      description: "Pay with Nagad mobile banking",
    },
    {
      id: "credit_card",
      name: "Credit/Debit Card",
      icon: CardIcon,
      description: "Pay with Visa/Mastercard",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Checkout</h1>
              <p className="text-gray-400 mt-1">Complete your order</p>
            </div>

            {/* Currency Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] rounded-lg transition"
              >
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">
                  {selectedCurrency.code}
                </span>
                <span className="text-gray-400">{selectedCurrency.symbol}</span>
                <RefreshCw className="w-3 h-3 text-gray-500" />
              </button>

              {showCurrencyDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCurrencyDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] rounded-lg shadow-lg overflow-hidden z-50">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => handleCurrencyChange(currency)}
                        className={`w-full px-4 py-2 text-left hover:bg-[#333] transition flex items-center justify-between ${
                          selectedCurrency.code === currency.code
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-white"
                        }`}
                      >
                        <span>{currency.code}</span>
                        <span className="text-sm text-gray-400">
                          {currency.symbol}
                        </span>
                      </button>
                    ))}
                    <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
                      Rate: 1 USD = {EXCHANGE_RATE} BDT
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-[#2A2A2A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">
                  Shipping Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="+8801XXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="House #, Road #, Area"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="Apartment, Floor, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="Dhaka"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="Dhaka"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="1212"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="Bangladesh"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-[#2A2A2A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">
                  Billing Information
                </h2>
              </div>

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useBillingSameAsShipping}
                  onChange={(e) =>
                    setUseBillingSameAsShipping(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-300">Same as shipping address</span>
              </label>

              {!useBillingSameAsShipping && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={billingAddress.fullName}
                        onChange={handleBillingAddressChange}
                        className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={billingAddress.phone}
                        onChange={handleBillingAddressChange}
                        className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={billingAddress.addressLine1}
                      onChange={handleBillingAddressChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingAddress.city}
                        onChange={handleBillingAddressChange}
                        className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={billingAddress.postalCode}
                        onChange={handleBillingAddressChange}
                        className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-[#2A2A2A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CardIcon className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 bg-black/20 hover:bg-black/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4 text-purple-500"
                    />
                    <method.icon className="w-6 h-6 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment Details for Online Methods */}
              {paymentMethod !== "cash_on_delivery" && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Transaction ID *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={paymentDetails.transactionId}
                      onChange={handlePaymentDetailsChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="Enter transaction ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={paymentDetails.mobileNumber}
                      onChange={handlePaymentDetailsChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-[#2A2A2A] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Order Notes (Optional)
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none resize-none"
                placeholder="Special instructions for delivery, etc."
              />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#2A2A2A] rounded-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-4">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="bg-black/20 rounded-lg p-3">
                    <div className="flex gap-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-purple-400 font-semibold text-sm mt-1">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updatingItemId === item.id}
                            className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white transition disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white text-sm min-w-[30px] text-center">
                            {updatingItemId === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updatingItemId === item.id}
                            className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white transition disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updatingItemId === item.id}
                            className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalInBDT)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shippingCostInBDT === 0
                      ? "Free"
                      : formatPrice(shippingCostInBDT)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(taxInBDT)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-purple-400">
                      {formatPrice(totalInBDT)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exchange rate info */}
              {selectedCurrency.code === "USD" && (
                <div className="mt-3 p-2 bg-blue-500/10 rounded-lg text-center">
                  <p className="text-xs text-blue-400">
                    Exchange Rate: 1 USD = {EXCHANGE_RATE} BDT
                  </p>
                </div>
              )}

              {/* Debug info (remove in production) */}
              <div className="mt-3 p-2 bg-gray-700/30 rounded-lg text-center">
                <p className="text-xs text-gray-400">
                  Token: {token ? "Present" : "Missing"}
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || orderLoading || !token}
                className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting || orderLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CardIcon className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms and Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
