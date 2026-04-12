// app/dashboard/orders/[orderId]/page.tsx (Updated)
"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Package,
    Truck,
    MapPin,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowLeft,
    Loader2,
    Printer,
    Download,
    Eye,
    FileText,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { StatusHistory, useOrder } from '../../../../contexts/OrderContext';

export default function OrderDetailsPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const {
        getOrderById,
        currentOrder,
        isLoading,
        cancelOrder,
        downloadInvoice,
        previewInvoice
    } = useOrder();
    const [isCancelling, setIsCancelling] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any>(null);

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

    const handleCancelOrder = async () => {
        if (confirm('Are you sure you want to cancel this order?')) {
            setIsCancelling(true);
            await cancelOrder(orderId as string);
            setIsCancelling(false);
            await loadOrder();
        }
    };

    const handleDownloadInvoice = async () => {
        setIsDownloading(true);
        await downloadInvoice(orderId as string);
        setIsDownloading(false);
    };

    const handlePreviewInvoice = async () => {
        const data = await previewInvoice(orderId as string);
        if (data) {
            setInvoiceData(data);
            setShowInvoiceModal(true);
        }
    };

    const handlePrint = () => {
        window.print();
    };

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return Clock;
            case 'delivered': return CheckCircle;
            case 'cancelled': return XCircle;
            default: return Package;
        }
    };

    if (isLoading || !currentOrder) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    const StatusIcon = getStatusIcon(currentOrder.status);

    return (
        <div className="py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Order Details</h1>
                            <p className="text-gray-400 mt-1">Order #{currentOrder.orderNumber}</p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={handlePreviewInvoice}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Preview Invoice
                            </button>
                            <button
                                onClick={handleDownloadInvoice}
                                disabled={isDownloading}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDownloading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                Download Invoice
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                            {['pending', 'confirmed'].includes(currentOrder.status) && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={isCancelling}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Timeline - Keep existing code */}
                <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(currentOrder.status)}`}>
                            <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Order Status</h2>
                            <p className="text-gray-400 capitalize">{currentOrder.status.replace(/_/g, ' ')}</p>
                        </div>
                    </div>

                    {/* Status History Timeline */}
                    <div className="mt-4 space-y-3">
                        {currentOrder.statusHistory.map((history: StatusHistory, index:number ) => (
                            <div key={index} className="flex gap-3">
                                <div className="relative">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                                    {index < currentOrder.statusHistory.length - 1 && (
                                        <div className="absolute top-4 left-0 w-0.5 h-full bg-purple-500/30"></div>
                                    )}
                                </div>
                                <div className="flex-1 pb-4">
                                    <p className="text-white font-medium capitalize">{history.status.replace(/_/g, ' ')}</p>
                                    <p className="text-sm text-gray-500">{history.note}</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {new Date(history.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rest of your order details - keep existing code */}
                {/* ... */}

                {/* Invoice Preview Modal */}
                {showInvoiceModal && invoiceData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#1a1a1a] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-purple-400" />
                                    <h2 className="text-xl font-bold text-white">Invoice Preview</h2>
                                </div>
                                <button
                                    onClick={() => setShowInvoiceModal(false)}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition"
                                >
                                    <XCircle className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Invoice Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="bg-white text-gray-900 rounded-xl p-8 max-w-2xl mx-auto">
                                    {/* Invoice Header */}
                                    <div className="text-center border-b pb-6 mb-6">
                                        <h1 className="text-3xl font-bold text-purple-600">GamersBD</h1>
                                        <p className="text-gray-600 mt-2">{invoiceData.company.address}</p>
                                        <p className="text-gray-600">Email: {invoiceData.company.email} | Phone: {invoiceData.company.phone}</p>
                                    </div>

                                    <h2 className="text-2xl font-bold text-center mb-6">INVOICE</h2>

                                    {/* Invoice Info */}
                                    <div className="flex justify-between mb-6">
                                        <div>
                                            <p><strong>Invoice Number:</strong> INV-{invoiceData.order.orderNumber}</p>
                                            <p><strong>Order Number:</strong> {invoiceData.order.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p><strong>Date:</strong> {new Date(invoiceData.order.createdAt).toLocaleDateString()}</p>
                                            <p><strong>Order Date:</strong> {new Date(invoiceData.order.placedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Addresses */}
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h3 className="font-bold mb-2">Bill To:</h3>
                                            <p>{invoiceData.order.billingAddress.fullName}</p>
                                            <p>{invoiceData.order.billingAddress.addressLine1}</p>
                                            {invoiceData.order.billingAddress.addressLine2 && <p>{invoiceData.order.billingAddress.addressLine2}</p>}
                                            <p>{invoiceData.order.billingAddress.city}, {invoiceData.order.billingAddress.state}</p>
                                            <p>{invoiceData.order.billingAddress.postalCode}, {invoiceData.order.billingAddress.country}</p>
                                            <p>Phone: {invoiceData.order.billingAddress.phone}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-2">Ship To:</h3>
                                            <p>{invoiceData.order.shippingAddress.fullName}</p>
                                            <p>{invoiceData.order.shippingAddress.addressLine1}</p>
                                            {invoiceData.order.shippingAddress.addressLine2 && <p>{invoiceData.order.shippingAddress.addressLine2}</p>}
                                            <p>{invoiceData.order.shippingAddress.city}, {invoiceData.order.shippingAddress.state}</p>
                                            <p>{invoiceData.order.shippingAddress.postalCode}, {invoiceData.order.shippingAddress.country}</p>
                                            <p>Phone: {invoiceData.order.shippingAddress.phone}</p>
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <table className="w-full mb-6 border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-gray-300">
                                                <th className="text-left py-2">Item</th>
                                                <th className="text-left py-2">Description</th>
                                                <th className="text-right py-2">Qty</th>
                                                <th className="text-right py-2">Price</th>
                                                <th className="text-right py-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceData.order.items.map((item: any, index: number) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="py-2">{index + 1}</td>
                                                    <td className="py-2">{item.product.name}</td>
                                                    <td className="text-right py-2">{item.quantity}</td>
                                                    <td className="text-right py-2">${item.priceAtTime.toFixed(2)}</td>
                                                    <td className="text-right py-2">${(item.priceAtTime * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Totals */}
                                    <div className="text-right space-y-2 border-t pt-4">
                                        <p><strong>Subtotal:</strong> ${invoiceData.order.subtotal.toFixed(2)}</p>
                                        <p><strong>Shipping:</strong> {invoiceData.order.shippingCost === 0 ? 'Free' : `$${invoiceData.order.shippingCost.toFixed(2)}`}</p>
                                        <p><strong>Tax (10%):</strong> ${invoiceData.order.tax.toFixed(2)}</p>
                                        {invoiceData.order.discount > 0 && (
                                            <p><strong>Discount:</strong> -${invoiceData.order.discount.toFixed(2)}</p>
                                        )}
                                        <p className="text-xl font-bold"><strong>Total:</strong> ${invoiceData.order.total.toFixed(2)}</p>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="font-bold mb-2">Payment Information:</h3>
                                        <p>Method: {invoiceData.order.payment.method.replace(/_/g, ' ').toUpperCase()}</p>
                                        <p>Status: {invoiceData.order.payment.status.toUpperCase()}</p>
                                        {invoiceData.order.payment.transactionId && (
                                            <p>Transaction ID: {invoiceData.order.payment.transactionId}</p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="text-center mt-8 pt-6 border-t text-gray-600 text-sm">
                                        <p>Thank you for shopping with GamersBD!</p>
                                        <p className="mt-2">For any queries, please contact our support team.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
                                <button
                                    onClick={() => setShowInvoiceModal(false)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleDownloadInvoice}
                                    disabled={isDownloading}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isDownloading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}