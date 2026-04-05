// components/TestCartAPI.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export const TestCartAPI = () => {
  const [status, setStatus] = useState<string>("Testing...");

  useEffect(() => {
    const testAPI = async () => {
      try {
        // Test the test endpoint first
        const testResponse = await axios.get("http://localhost:5000/api/cart/test");
        console.log("Cart test endpoint:", testResponse.data);
        
        // Try to get cart (will fail without auth, that's fine)
        try {
          const cartResponse = await axios.get("http://localhost:5000/api/cart");
          console.log("Cart response (no auth):", cartResponse.data);
        } catch (error: any) {
          console.log("Cart auth required (expected):", error.response?.status);
        }
        
        setStatus("✅ Cart API is reachable!");
      } catch (error: any) {
        console.error("API test failed:", error);
        setStatus(`❌ API Error: ${error.message}`);
      }
    };
    
    testAPI();
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-xs z-50">
      {status}
    </div>
  );
};