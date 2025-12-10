import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface ThemeColors {
  // Background colors
  background: {
    primary: string; // Main background
    secondary: string; // Cards, panels
    tertiary: string; // Headers, navigation
    accent: string; // Highlighted areas
  };

  // Text colors
  text: {
    primary: string; // Main text
    secondary: string; // Muted text
    accent: string; // Highlighted text
    inverse: string; // Contrast text
  };

  // Border colors
  border: {
    primary: string; // Main borders
    secondary: string; // Subtle borders
    accent: string; // Active/highlighted borders
  };

  // Status colors
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  // Interactive colors
  interactive: {
    primary: string; // Primary buttons, links
    primaryHover: string;
    secondary: string; // Secondary buttons
    secondaryHover: string;
  };
}

export const lightTheme: ThemeColors = {
  background: {
    primary: "#F5F7FA", // Main background
    secondary: "#FFFFFF", // Cards
    tertiary: "#0A2A6B", // Navbar, headings
    accent: "#E2E8F0", // Card border
  },
  text: {
    primary: "#0A2A6B", // Headings
    secondary: "#4A5568", // Paragraph
    accent: "#00C8FF", // Highlighted text
    inverse: "#FFFFFF", // Contrast text
  },
  border: {
    primary: "#E2E8F0", // Card border
    secondary: "#E2E8F0", // Subtle borders
    accent: "#00C8FF", // Active/highlighted borders
  },
  status: {
    success: "#047857",
    warning: "#b45309",
    error: "#b91c1c",
    info: "#1d4ed8",
  },
  interactive: {
    primary: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)", // Button gradient
    primaryHover: "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)", // Button hover gradient
    secondary: "#6b7280",
    secondaryHover: "#9ca3af",
  },
};

export const darkTheme: ThemeColors = {
  background: {
    primary: "#0B1120", // Main background
    secondary: "#1E293B", // Cards
    tertiary: "#00C8FF", // Headings, navbar highlight
    accent: "#334155", // Card border
  },
  text: {
    primary: "#E6F4FF", // Headings
    secondary: "#CBD5E1", // Paragraph
    accent: "#00C8FF", // Highlighted text
    inverse: "#0A2A6B", // Contrast text
  },
  border: {
    primary: "#334155", // Card border
    secondary: "#334155", // Subtle borders
    accent: "#00C8FF", // Active/highlighted borders
  },
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
  interactive: {
    primary: "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)", // Button gradient
    primaryHover: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)", // Button hover gradient
    secondary: "#6b7280",
    secondaryHover: "#9ca3af",
  },
};

export type ThemeMode = "light" | "dark";

interface AdminThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(
  undefined,
);

export const useAdminTheme = (): AdminThemeContextType => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
};

interface AdminThemeProviderProps {
  children: ReactNode;
}

export const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    return (savedTheme as ThemeMode) || "dark";
  });

  const colors = theme === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: AdminThemeContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  };

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
};
