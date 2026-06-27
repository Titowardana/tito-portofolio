"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (initialTheme) return initialTheme;
    if (typeof window === "undefined") return "dark";
    return document.documentElement.classList.contains("light") ? "light" : "dark";
  });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("theme", next);
    document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
