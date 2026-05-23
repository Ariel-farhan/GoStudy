'use client';

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
  language: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  toggleTheme: () => {},
  language: "id",
  setLanguage: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguageState] = useState<"id" | "en">("id");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/user/theme")
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const text = await r.text();
        if (!text) throw new Error("Empty response");
        return JSON.parse(text);
      })
      .then((data) => {
        setDarkMode(data.darkMode ?? true);
        setLanguageState(data.language ?? "id");
      })
      .catch((err) => {
        console.error("Failed to load theme:", err);
      });
  }, [status]);

  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    await fetch("/api/user/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ darkMode: newMode }),
      signal: abortRef.current.signal,
    }).catch(() => {});
  };

  const setLanguage = async (lang: "id" | "en") => {
    setLanguageState(lang);
    await fetch("/api/user/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: lang }),
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}