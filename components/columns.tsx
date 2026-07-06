"use client";

import React from "react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { AffiliateRow } from "@/lib/affiliate-data";
import { formatCurrency, formatDate, formatNumber } from "@/utils/formatters";
import { cn } from "@/utils/cn";

/**
 * Reusable sortable column header component.
 * Displays interactive sort indicators (Ascending, Descending, or Unsorted).
 */
interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
  align?: "left" | "right" | "center";
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  align = "left",
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400", className)}>
        {title}
      </div>
    );
  }

  const isSorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider transition-colors py-1 px-1.5 -ml-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700/60 cursor-pointer select-none",
        align === "right" && "ml-auto flex-row-reverse -mr-1.5",
        align === "center" && "mx-auto",
        isSorted ? "text-slate-900 dark:text-slate-100 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
        className
      )}
      aria-label={`Sort by ${title}. Currently ${
        isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : "unsorted"
      }`}
    >
      <span>{title}</span>
      {isSorted === "desc" ? (
        <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
      ) : isSorted === "asc" ? (
        <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
      ) : (
        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 shrink-0" />
      )}
    </button>
  );
}

/**
 * Helper to render status badge with appropriate semantic styling.
 */
function StatusBadge({ status }: { status: AffiliateRow["status"] }) {
  const styles = {
    active: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    paused: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    flagged: "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize",
        styles
      )}
    >
      {status}
    </span>
  );
}

/**
 * Helper to render region badge.
 */
function RegionBadge({ region }: { region: AffiliateRow["region"] }) {
  const styles = {
    EU: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-bold",
    NA: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    APAC: "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    LATAM: "bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  }[region];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
        styles
      )}
    >
      {region}
    </span>
  );
}

/**
 * Static column definitions for TanStack Table with Sorting configured.
 */
export const baseColumns: ColumnDef<AffiliateRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-medium">
        {row.getValue("id")}
      </span>
    ),
    enableSorting: false,
    size: 110,
  },
  {
    accessorKey: "affiliate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Affiliate" />,
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900 dark:text-slate-100">
        {row.getValue("affiliate")}
      </span>
    ),
    sortingFn: "alphanumeric",
    enableSorting: true,
    size: 180,
  },
  {
    accessorKey: "campaign",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Campaign" />,
    cell: ({ row }) => (
      <span className="text-slate-700 dark:text-slate-300 font-medium">
        {row.getValue("campaign")}
      </span>
    ),
    sortingFn: "alphanumeric",
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "region",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Region" />,
    cell: ({ row }) => <RegionBadge region={row.getValue("region")} />,
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "clicks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Clicks" align="right" />,
    cell: ({ row }) => (
      <div className="text-right font-mono text-xs text-slate-700 dark:text-slate-300">
        {formatNumber(row.getValue("clicks"))}
      </div>
    ),
    sortingFn: "basic",
    enableSorting: true,
    size: 110,
  },
  {
    accessorKey: "conversions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Conversions" align="right" />,
    cell: ({ row }) => (
      <div className="text-right font-mono text-xs text-slate-700 dark:text-slate-300">
        {formatNumber(row.getValue("conversions"))}
      </div>
    ),
    sortingFn: "basic",
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Revenue (USD)" align="right" />,
    cell: ({ row }) => (
      <div className="text-right font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        {formatCurrency(row.getValue("revenue"))}
      </div>
    ),
    sortingFn: "basic",
    enableSorting: true,
    size: 140,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    enableSorting: true,
    size: 110,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated Date" />,
    cell: ({ row }) => (
      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatDate(row.getValue("updatedAt"))}
      </span>
    ),
    sortingFn: "datetime",
    enableSorting: true,
    size: 130,
  },
];
