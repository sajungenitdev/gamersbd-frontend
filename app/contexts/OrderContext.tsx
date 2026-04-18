// app/contexts/OrderContext.tsx
"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUserAuth } from './UserAuthContext';

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    slug: string;
    sku?: string;
  };
  quantity: number;
  platform: string;
  priceAtTime: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentDetails {
  method: 'bkash' | 'nagad' | 'rocket' | 'credit_card' | 'debit_card' | 'cash_on_delivery';
  transactionId?: string;
  mobileNumber?: string;
  amount?: number;
  currency?: string;
  status?: string;
  completedAt?: string;
}

export interface StatusHistory {
  status: string;
  note: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded' | 'on_hold';
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  payment: PaymentDetails;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  statusHistory: StatusHistory[];
  placedAt: string;
  confirmedAt?: string;
  processedAt?: string;
  shippedAt?: string;
  inTransitAt?: string;
  outForDeliveryAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  onHoldAt?: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceData {
  order: Order;
  company: {
    name: string;
    address: string;
    email: string;
    phone: string;
    website: string;
    logo?: string;
  };
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  createOrder: (orderData: any) => Promise<Order | null>;
  getMyOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  getOrderTracking: (orderId: string) => Promise<any>;
  getPaymentDetails: (orderId: string) => Promise<any>;
  downloadInvoice: (orderId: string) => Promise<void>;
  previewInvoice: (orderId: string) => Promise<InvoiceData | null>;
  sendInvoiceEmail: (orderId: string, email?: string) => Promise<boolean>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useUserAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gamersbd-server.onrender.com';

  const getAuthHeaders = () => ({
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // @desc    Create new order from cart
  const createOrder = async (orderData: any): Promise<Order | null> => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/orders/checkout`,
        orderData,
        getAuthHeaders()
      );

      if (response.data.success) {
        setCurrentOrder(response.data.order);
        toast.success('Order created successfully!');
        return response.data.order;
      }
      return null;
    } catch (error: any) {
      console.error('Create order error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // @desc    Get logged in user's orders
  const getMyOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/my-orders`,
        getAuthHeaders()
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  // @desc    Get single order by ID
  const getOrderById = async (orderId: string): Promise<Order | null> => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/${orderId}`,
        getAuthHeaders()
      );

      if (response.data.success) {
        setCurrentOrder(response.data.order);
        return response.data.order;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // @desc    Cancel order
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {},
        getAuthHeaders()
      );

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        await getMyOrders(); // Refresh orders list
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // @desc    Get order tracking information
  const getOrderTracking = async (orderId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/${orderId}/tracking`,
        getAuthHeaders()
      );

      if (response.data.success) {
        return response.data.tracking;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to fetch tracking:', error);
      return null;
    }
  };

  // @desc    Get payment details
  const getPaymentDetails = async (orderId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/${orderId}/payment`,
        getAuthHeaders()
      );

      if (response.data.success) {
        return response.data.payment;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to fetch payment details:', error);
      return null;
    }
  };

  // @desc    Download invoice as PDF
  const downloadInvoice = async (orderId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/${orderId}/invoice`,
        {
          ...getAuthHeaders(),
          responseType: 'blob' // Important for file download
        }
      );
      
      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
    } catch (error: any) {
      console.error('Failed to download invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to download invoice');
    }
  };

  // @desc    Preview invoice (get data for modal preview)
  const previewInvoice = async (orderId: string): Promise<InvoiceData | null> => {
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/${orderId}/invoice/preview`,
        getAuthHeaders()
      );
      
      if (response.data.success) {
        return response.data.invoice;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to preview invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to load invoice preview');
      return null;
    }
  };

  // @desc    Send invoice via email
  const sendInvoiceEmail = async (orderId: string, email?: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${API_URL}/api/orders/${orderId}/send-invoice`,
        { email: email || user?.email },
        getAuthHeaders()
      );
      
      if (response.data.success) {
        toast.success('Invoice sent to your email');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Failed to send invoice email:', error);
      toast.error(error.response?.data?.message || 'Failed to send invoice email');
      return false;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-400 bg-yellow-400/10',
      confirmed: 'text-blue-400 bg-blue-400/10',
      processing: 'text-purple-400 bg-purple-400/10',
      shipped: 'text-indigo-400 bg-indigo-400/10',
      in_transit: 'text-cyan-400 bg-cyan-400/10',
      out_for_delivery: 'text-orange-400 bg-orange-400/10',
      delivered: 'text-green-400 bg-green-400/10',
      cancelled: 'text-red-400 bg-red-400/10',
      refunded: 'text-gray-400 bg-gray-400/10',
      on_hold: 'text-yellow-400 bg-yellow-400/10',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10';
  };

  // Helper function to get status text
  const getStatusText = (status: string): string => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Helper function to format date
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to calculate estimated delivery date
  const getEstimatedDelivery = (placedAt: string): string => {
    const date = new Date(placedAt);
    date.setDate(date.getDate() + 5); // 5 days delivery estimate
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        isLoading,
        createOrder,
        getMyOrders,
        getOrderById,
        cancelOrder,
        getOrderTracking,
        getPaymentDetails,
        downloadInvoice,
        previewInvoice,
        sendInvoiceEmail,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook for order statistics (for admin dashboard)
export const useOrderStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useUserAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gamersbd-server.onrender.com';

  const getOrderStats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/stats/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setStats(response.data.stats);
        return response.data.stats;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to fetch order stats:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading, getOrderStats };
};