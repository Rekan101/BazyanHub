"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext =
  createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "bazian-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");

  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>("light");

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem(STORAGE_KEY);

    const initialTheme: Theme =
      savedTheme === "dark" ||
      savedTheme === "light"
        ? savedTheme
        : window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches
        ? "dark"
        : "light";

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);

      applyTheme(nextTheme);

      window.localStorage.setItem(
        STORAGE_KEY,
        nextTheme
      );
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setTheme(
      theme === "dark"
        ? "light"
        : "dark"
    );
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme]
  );

  /*
   * Prevents theme-dependent UI from
   * rendering with the wrong state before
   * the client has initialized.
   */
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}