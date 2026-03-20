import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("thefoundry:theme");

    // If user has saved preference → use it
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
      return;
    }

    // use system preference 
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = systemDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", systemDark);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("thefoundry:theme", next);
      return next;
    });
  }, []);

  return { theme, toggle };
}