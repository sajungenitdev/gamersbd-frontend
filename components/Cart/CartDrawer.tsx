// components/cart/CartDrawer.tsx
"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../app/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "../../app/contact/CurrencyContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { formatPrice } = useCurrency();
  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    isLoading,
  } = useCart();

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#1a1a1a] shadow-xl border-l border-gray-800">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          Shopping Cart ({totalItems})
                        </Dialog.Title>
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-300 transition-colors"
                          onClick={onClose}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-8">
                        {items.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingBag className="mx-auto h-12 w-12 text-gray-600" />
                            <h3 className="mt-2 text-sm font-medium text-gray-400">
                              Your cart is empty
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Start adding some items to your cart!
                            </p>
                            <button
                              onClick={onClose}
                              className="mt-4 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 text-sm font-medium text-white hover:from-amber-700 hover:to-amber-800 transition-all"
                            >
                              Continue Shopping
                            </button>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-gray-800">
                              {items.map((item) => (
                                <li key={item._id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-800 bg-[#252525]">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 text-gray-600" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-white">
                                        <h3 className="truncate pr-2">
                                          {item.name}
                                        </h3>
                                        <p className="ml-4">
                                          {formatPrice(item.price)}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-400">
                                        {formatPrice(item.price)} each
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm mt-2">
                                      <div className="flex items-center gap-2 border border-gray-800 rounded-md bg-[#252525]">
                                        <button
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item._id,
                                              item.quantity - 1,
                                            )
                                          }
                                          className="p-1.5 bg-gray-400 hover:bg-gray-700 transition-colors rounded-l-md"
                                          disabled={isLoading}
                                        >
                                          <Minus className="h-3 w-3 text-white" />
                                        </button>
                                        <span className="w-8 text-center text-white">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item._id,
                                              item.quantity + 1,
                                            )
                                          }
                                          className="p-1.5 bg-gray-400 hover:bg-gray-700 transition-colors rounded-r-md"
                                          disabled={isLoading}
                                        >
                                          <Plus className="h-3 w-3 text-white" />
                                        </button>
                                      </div>

                                      <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                        disabled={isLoading}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {items.length > 0 && (
                      <div className="border-t border-gray-800 px-4 py-6 sm:px-6 bg-[#1a1a1a]">
                        <div className="flex justify-between text-base font-medium text-white mb-2">
                          <p>Subtotal</p>
                          <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="space-y-3">
                          <Link
                            href="/checkout"
                            onClick={onClose}
                            className="flex items-center justify-center rounded-md bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-800 transition-all duration-300 w-full"
                          >
                            Proceed to Checkout
                          </Link>
                          <button
                            type="button"
                            className="w-full text-center text-sm text-gray-400 hover:text-amber-500 transition-colors"
                            onClick={onClose}
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
