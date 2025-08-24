import React from "react";
import { useTheme } from "../theme/ThemeProvider";

export default function Header() {
  const { isDark, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Sunset API</h1>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Dark Mode</span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={isDark} onChange={toggle} />
            <div className={`block w-12 h-6 rounded-full transition ${isDark ? "bg-indigo-600" : "bg-gray-300"}`} />
            <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${isDark ? "translate-x-6" : ""}`} />
          </div>
        </label>
      </div>
    </header>
  );
}
