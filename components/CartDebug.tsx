// components/CartDebug.tsx
"use client";
import { useEffect } from "react";
import { useCart } from "../app/contexts/CartContext";

export const CartDebug = () => {
  const { items, totalItems, isLoading, refreshCart } = useCart();
  
  useEffect(() => {
    console.log("=== CART DEBUG ===");
    console.log("Items:", items);
    console.log("Total Items:", totalItems);
    console.log("Is Loading:", isLoading);
    console.log("=================");
  }, [items, totalItems, isLoading]);
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-md shadow-xl border border-gray-700">
      <div className="font-bold mb-2 text-amber-500">🛒 Cart Debug:</div>
      <div>Items count: {items.length}</div>
      <div>Total items: {totalItems}</div>
      <div>Is loading: {isLoading ? "Yes" : "No"}</div>
      <button 
        onClick={refreshCart}
        className="mt-2 px-2 py-1 bg-amber-600 rounded text-white text-xs hover:bg-amber-700 transition"
      >
        Refresh Cart
      </button>
      <div className="mt-2 text-gray-400 text-xs max-h-40 overflow-y-auto">
        {items.map((item, i) => (
          <div key={i} className="border-t border-gray-700 mt-1 pt-1">
            {item.name} x{item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
};