// app/order-confirmation/[orderId]/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { toast } from 'react-hot-toast';

export default function OrderConfirmationPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const { getOrderById, currentOrder, isLoading } = useOrder();
    const { user } = useUserAuth();
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    const loadOrder = async () => {
        const order = await getOrderById(orderId as string);
        if (!order) {
            toast.error('Order not found');
            router.push('/dashboard/orders');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadInvoice = async () => {
        setIsDownloading(true);
        try {
            // Implement invoice download logic here
            toast.success('Invoice downloaded');
        } catch (error) {
            toast.error('Failed to download invoice');
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading || !currentOrder) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10';
            case 'confirmed': return 'text-blue-400 bg-blue-400/10';
            case 'processing': return 'text-purple-400 bg-purple-400/10';
            case 'shipped': return 'text-indigo-400 bg-indigo-400/10';
            case 'in_transit': return 'text-cyan-400 bg-cyan-400/10';
            case 'out_for_delivery': return 'text-orange-400 bg-orange-400/10';
            case 'delivered': return 'text-green-400 bg-green-400/10';
            case 'cancelled': return 'text-red-400 bg-red-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    const getStatusText = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
                    <p className="text-gray-400">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>
                </div>

                {/* Order Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#2A2A2A] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-purple-400" />
                            <div>
                                <p className="text-sm text-gray-400">Order Number</p>
                                <p className="text-white font-semibold">{currentOrder.orderNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#2A2A2A] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-purple-400" />
                            <div>
                                <p className="text-sm text-gray-400">Placed On</p>
                                <p className="text-white font-semibold">
                                    {new Date(currentOrder.placedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
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
                                    {currentOrder.payment.method.replace(/_/g, ' ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#2A2A2A] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentOrder.status)}`}>
                                {getStatusText(currentOrder.status)}
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Order Status</p>
                                <p className="text-white font-semibold">{getStatusText(currentOrder.status)}</p>
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
                        {currentOrder.items.map((item) => (
                            <div key={item._id} className="p-6 flex gap-4">
                                <img
                                    src={item.product.images?.[0] || '/placeholder.png'}
                                    alt={item.product.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <Link href={`/product/${item.product.slug || item.product._id}`}>
                                        <h3 className="text-white font-semibold hover:text-purple-400 transition">
                                            {item.product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Quantity: {item.quantity} × ${item.priceAtTime.toFixed(2)}
                                    </p>
                                    {item.platform && (
                                        <p className="text-gray-500 text-xs mt-1">Platform: {item.platform}</p>
                                    )}
                                </div>
                                <p className="text-purple-400 font-semibold">
                                    ${(item.priceAtTime * item.quantity).toFixed(2)}
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
                            <span>${currentOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Shipping</span>
                            <span>{currentOrder.shippingCost === 0 ? 'Free' : `$${currentOrder.shippingCost.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Tax (10%)</span>
                            <span>${currentOrder.tax.toFixed(2)}</span>
                        </div>
                        {currentOrder.discount > 0 && (
                            <div className="flex justify-between text-green-400">
                                <span>Discount</span>
                                <span>-${currentOrder.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="border-t border-gray-700 pt-2 mt-2">
                            <div className="flex justify-between text-white font-bold text-lg">
                                <span>Total</span>
                                <span className="text-purple-400">${currentOrder.total.toFixed(2)}</span>
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
                            <p className="font-medium">{currentOrder.shippingAddress.fullName}</p>
                            <p>{currentOrder.shippingAddress.addressLine1}</p>
                            {currentOrder.shippingAddress.addressLine2 && <p>{currentOrder.shippingAddress.addressLine2}</p>}
                            <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state}</p>
                            <p>{currentOrder.shippingAddress.postalCode}, {currentOrder.shippingAddress.country}</p>
                            <p className="flex items-center gap-2 mt-2">
                                <Phone className="w-4 h-4" />
                                {currentOrder.shippingAddress.phone}
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#2A2A2A] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg font-bold text-white">Billing Address</h2>
                        </div>
                        <div className="space-y-1 text-gray-300">
                            <p className="font-medium">{currentOrder.billingAddress.fullName}</p>
                            <p>{currentOrder.billingAddress.addressLine1}</p>
                            {currentOrder.billingAddress.addressLine2 && <p>{currentOrder.billingAddress.addressLine2}</p>}
                            <p>{currentOrder.billingAddress.city}, {currentOrder.billingAddress.state}</p>
                            <p>{currentOrder.billingAddress.postalCode}, {currentOrder.billingAddress.country}</p>
                            <p className="flex items-center gap-2 mt-2">
                                <Phone className="w-4 h-4" />
                                {currentOrder.billingAddress.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/dashboard/orders"
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        View All Orders
                    </Link>

                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        Print
                    </button>

                    <button
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
                    </button>

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
                        A confirmation email has been sent to <span className="text-white">{user?.email}</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        You can track your order status in your dashboard
                    </p>
                </div>
            </div>
        </div>
    );
}