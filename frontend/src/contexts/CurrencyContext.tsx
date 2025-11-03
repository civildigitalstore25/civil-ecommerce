import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type CurrencyType = "INR" | "USD";

export interface CurrencyInfo {
  code: CurrencyType;
  symbol: string;
  name: string;
  flag: string;
  exchangeRate: number; // Rate from USD to this currency
}

export const currencies: Record<CurrencyType, CurrencyInfo> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    exchangeRate: 1,
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
    exchangeRate: 83, // 1 USD = 83 INR (approximate)
  },
};

interface CurrencyContextType {
  selectedCurrency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  getCurrencyInfo: (currency?: CurrencyType) => CurrencyInfo;
  formatPrice: (priceINR: number, priceUSD?: number) => string;
  formatPriceWithSymbol: (priceINR: number, priceUSD?: number) => string;
  getCurrentPrice: (priceINR: number, priceUSD?: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem("preferred-currency");
    return (saved as CurrencyType) || "INR"; // Default to INR
  });

  useEffect(() => {
    // Save currency preference to localStorage
    localStorage.setItem("preferred-currency", selectedCurrency);
  }, [selectedCurrency]);

  const setCurrency = (currency: CurrencyType) => {
    setSelectedCurrency(currency);
  };

  const getCurrencyInfo = (currency?: CurrencyType): CurrencyInfo => {
    return currencies[currency || selectedCurrency];
  };

  const getCurrentPrice = (priceINR: number, priceUSD?: number): number => {
    if (selectedCurrency === "USD") {
      return priceUSD || priceINR / currencies.INR.exchangeRate;
    }
    return priceINR;
  };

  const formatPrice = (priceINR: number, priceUSD?: number): string => {
    const price = getCurrentPrice(priceINR, priceUSD);

    if (selectedCurrency === "USD") {
      return price.toFixed(0);
    }

    // Format INR with Indian number system (lakhs/crores)
    return new Intl.NumberFormat("en-IN").format(Math.round(price));
  };

  const formatPriceWithSymbol = (
    priceINR: number,
    priceUSD?: number,
  ): string => {
    const currencyInfo = getCurrencyInfo();
    const formattedPrice = formatPrice(priceINR, priceUSD);
    return `${currencyInfo.symbol}${formattedPrice}`;
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    setCurrency,
    getCurrencyInfo,
    formatPrice,
    formatPriceWithSymbol,
    getCurrentPrice,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
