// app/contexts/CurrencyContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

const EXCHANGE_RATE = 110; // 1 USD = 110 BDT

export const currencies: Currency[] = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 / EXCHANGE_RATE },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInBDT: number) => number;
  formatPrice: (priceInBDT: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency) {
      const found = currencies.find(c => c.code === savedCurrency);
      if (found) setCurrency(found);
    }
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency.code);
  };

  const convertPrice = (priceInBDT: number) => {
    if (currency.code === 'BDT') return priceInBDT;
    return priceInBDT * currency.rate;
  };

  const formatPrice = (priceInBDT: number) => {
    const converted = convertPrice(priceInBDT);
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};