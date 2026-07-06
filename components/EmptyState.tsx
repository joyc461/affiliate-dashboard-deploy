"use client";

import React from "react";
import { SearchX, RotateCcw } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
}

/**
 * Clean empty state rendered when no rows match the active filter or role criteria.
 */
export function EmptyState({
  title = "No affiliates found",
  description = "No affiliate records match your search query or role permissions. Try adjusting your filters.",
  onReset,
  resetLabel = "Clear filters",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl my-6 shadow-xs">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {description}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
}
