// app/dashboard/orders/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Eye,
  XCircle,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useOrder } from '../../../contexts/OrderContext';

export default function MyOrdersPage() {
  const { orders, isLoading, getMyOrders, cancelOrder } = useOrder();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    await getMyOrders();
  };
  
  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      setCancellingId(null);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'text-yellow-400 bg-yellow-400/10', icon: Clock, text: 'Pending' },
      confirmed: { color: 'text-blue-400 bg-blue-400/10', icon: CheckCircle, text: 'Confirmed' },
      processing: { color: 'text-purple-400 bg-purple-400/10', icon: Package, text: 'Processing' },
      shipped: { color: 'text-indigo-400 bg-indigo-400/10', icon: Truck, text: 'Shipped' },
      in_transit: { color: 'text-cyan-400 bg-cyan-400/10', icon: Truck, text: 'In Transit' },
      out_for_delivery: { color: 'text-orange-400 bg-orange-400/10', icon: Truck, text: 'Out for Delivery' },
      delivered: { color: 'text-green-400 bg-green-400/10', icon: CheckCircle, text: 'Delivered' },
      cancelled: { color: 'text-red-400 bg-red-400/10', icon: XCircle, text: 'Cancelled' },
      refunded: { color: 'text-gray-400 bg-gray-400/10', icon: AlertCircle, text: 'Refunded' },
      on_hold: { color: 'text-yellow-400 bg-yellow-400/10', icon: Clock, text: 'On Hold' },
    };
    
    const cfg = config[status as keyof typeof config] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
        <cfg.icon className="w-3 h-3" />
        {cfg.text}
      </span>
    );
  };
  
  const filteredOrders = orders.filter((order: any) => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchTerm && !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <p className="text-gray-400 mt-1">View and track your orders</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#2A2A2A] text-gray-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        
        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-[#2A2A2A] rounded-xl">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'No orders match your search' : 'You haven\'t placed any orders yet'}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order : any) => (
              <div
                key={order._id}
                className="bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Order Number</p>
                    <p className="text-white font-semibold">{order.orderNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Placed On</p>
                    <p className="text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-purple-400 font-bold">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Status</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                
                {/* Order Items Preview */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 3).map((item: any) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <img
                          src={item.product.images?.[0] || '/placeholder.png'}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-white text-sm line-clamp-1">{item.product.name}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-xs">+{order.items.length - 3}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="p-6 flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/orders/${order._id}`}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                  
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {cancellingId === order._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Cancel Order
                    </button>
                  )}
                  
                  {order.trackingNumber && (
                    <button
                      onClick={() => window.open(order.trackingUrl, '_blank')}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}