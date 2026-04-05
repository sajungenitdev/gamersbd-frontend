// components/DebugCart.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export const DebugCart = () => {
  const [status, setStatus] = useState<string>("Checking...");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const checkAPI = async () => {
      // Check token
      const userToken = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
      setToken(userToken ? `${userToken.substring(0, 20)}...` : "No token");
      
      // Test cart endpoint
      try {
        console.log("🔍 Testing cart API...");
        const response = await axios.get("http://localhost:5000/api/cart/test");
        console.log("✅ Cart test endpoint:", response.data);
        setStatus("✅ Cart API is reachable");
      } catch (error: any) {
        console.error("❌ API test failed:", error);
        setStatus(`❌ Error: ${error.message}`);
      }
    };
    
    checkAPI();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white px-4 py-2 rounded-lg text-xs z-50 font-mono space-y-1 border border-gray-700">
      <div>🛒 Cart Debug</div>
      <div>Status: {status}</div>
      <div>Token: {token || "None"}</div>
    </div>
  );
};