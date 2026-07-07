"use client";

import React from "react";
import { Shield, Eye } from "lucide-react";
import { Role } from "@/lib/affiliate-data";

export interface RoleToggleProps {
  role: Role;
  setRole: (role: Role) => void;
}

/**
 * Segmented button allowing the evaluator to toggle between Admin and Viewer roles.
 */
export function RoleToggle({ role, setRole }: RoleToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 select-none shadow-xs">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 hidden sm:inline">
        Role Gate:
      </span>
      <button
        type="button"
        onClick={() => setRole("admin")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
          role === "admin"
            ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/60 dark:border-slate-700 font-semibold"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>

      <button
        type="button"
        onClick={() => setRole("viewer")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
          role === "viewer"
            ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200/60 dark:border-slate-700 font-semibold"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span>Viewer (EU Only)</span>
      </button>
    </div>
  );
}
