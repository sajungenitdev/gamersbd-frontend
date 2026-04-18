// components/PromotionModalManager.tsx (No delay version)
"use client";

import { useState, useEffect } from "react";
import PromotionModal from "./PromotionModal";

export default function PromotionModalManager() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open modal immediately when page loads
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return <PromotionModal onClose={handleClose} />;
}