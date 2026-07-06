"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

/**
 * Reusable KPI display card for high-level statistics.
 */
export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  className,
  valueClassName,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-all",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className={cn("text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100", valueClassName)}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
        {icon}
      </div>
    </div>
  );
}
