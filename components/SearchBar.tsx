"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Reusable search input with integrated clear button and accessibility attributes.
 * Parent components should pair this with `useDeferredValue` when filtering large datasets (10k+ rows).
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search affiliates or campaigns....",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center w-full max-w-md", className)}>
      <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-xs"
        aria-label="Global search across affiliates and campaigns"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Clear search query"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
