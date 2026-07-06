"use client";

import React from "react";
import { SearchBar } from "./SearchBar";
import { RoleToggle } from "./RoleToggle";
import { formatNumber } from "@/utils/formatters";
import { Role } from "@/lib/affiliate-data";
import { ShieldAlert } from "lucide-react";

export interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredCount: number;
  totalCount: number;
  role: Role;
  setRole: (role: Role) => void;
}

/**
 * Responsive header bar containing the global search input and the role toggle.
 */
export function TableToolbar({
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
  role,
  setRole,
}: TableToolbarProps) {
  const isViewer = role === "viewer";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Filter by affiliate name or campaign..."
        />
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 flex-wrap">
          <span>
            Showing{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatNumber(filteredCount)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatNumber(totalCount)}
            </span>{" "}
            authorized rows
          </span>

          {isViewer && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <ShieldAlert className="w-3 h-3" />
              Viewer Policy: EU Only · Flagged & Revenue Excluded
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <RoleToggle role={role} setRole={setRole} />
      </div>
    </div>
  );
}
