"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  FilterFn,
  VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowUpDown } from "lucide-react";
import { AffiliateRow, Role } from "@/lib/affiliate-data";
import { baseColumns } from "./columns";
import { EmptyState } from "./EmptyState";

export interface DataTableProps {
  data: AffiliateRow[];
  role: Role;
  globalFilter?: string;
  onResetFilters?: () => void;
}

/**
 * Custom high-performance filter function that explicitly checks only 'affiliate' and 'campaign'.
 */
const customGlobalFilterFn: FilterFn<AffiliateRow> = (row, _columnId, filterValue: string) => {
  const query = filterValue.toLowerCase().trim();
  if (!query) return true;

  const affiliate = String(row.getValue("affiliate") || "").toLowerCase();
  const campaign = String(row.getValue("campaign") || "").toLowerCase();

  return affiliate.includes(query) || campaign.includes(query);
};

/**
 * Core data table component powered by TanStack Table v8 and TanStack Virtual v3.
 * Renders only ~25 visible DOM rows at 60 FPS without pagination.
 */
export function DataTable({ data, role, globalFilter = "", onResetFilters }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<AffiliateRow>[]>(() => baseColumns, []);

  // Column-Level Security (CLS): Suppress sensitive revenue column when role is Viewer
  const columnVisibility = useMemo<VisibilityState>(() => ({
    revenue: role === "admin",
  }), [role]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    globalFilterFn: customGlobalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const visibleRows = table.getRowModel().rows;
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // TanStack Virtual v3 setup for high-frequency DOM virtualization
  const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48, // Estimated row height in px
    overscan: 12, // Render 12 extra rows above and below viewport
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // Calculate top and bottom spacer dimensions to preserve native HTML table scrollbar accuracy
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  // Reset scroll offset to 0 when filters, sorting, or role visibility change
  useEffect(() => {
    rowVirtualizer.scrollToOffset(0);
  }, [sorting, globalFilter, columnVisibility, rowVirtualizer]);

  const activeSorts = sorting.map((s) => {
    const colName = s.id === "revenue" ? "Revenue" : s.id.charAt(0).toUpperCase() + s.id.slice(1);
    return `${colName} (${s.desc ? "Descending" : "Ascending"})`;
  });

  return (
    <div className="space-y-2 my-4">
      {/* Active sort summary bar */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Active Sort:</span>
          {activeSorts.length > 0 ? (
            <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {activeSorts.join(", ")}
            </span>
          ) : (
            <span className="italic">None (Default order)</span>
          )}
        </div>
        {sorting.length > 0 && (
          <button
            type="button"
            onClick={() => setSorting([])}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
          >
            Reset sort
          </button>
        )}
      </div>

      {visibleRows.length === 0 ? (
        <EmptyState
          title="No affiliate records match your filter"
          description={`We couldn't find any affiliate or campaign matching "${globalFilter}". Try clearing your search query or switching role permissions.`}
          onReset={onResetFilters}
          resetLabel="Clear search filter"
        />
      ) : (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Virtual scroll container */}
          <div
            ref={tableContainerRef}
            className="overflow-auto max-h-[650px] virtual-table-container relative w-full"
          >
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/90 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-2xs">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: `${header.getSize()}px`, minWidth: `${header.getSize()}px` }}
                        className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none whitespace-nowrap bg-slate-50 dark:bg-slate-800/95"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {/* Top spacer row to maintain accurate scroll height */}
                {paddingTop > 0 && (
                  <tr>
                    <td
                      style={{ height: `${paddingTop}px` }}
                      colSpan={table.getVisibleFlatColumns().length}
                    />
                  </tr>
                )}

                {/* Render only visible virtualized rows */}
                {virtualRows.map((virtualRow) => {
                  const row = visibleRows[virtualRow.index];
                  return (
                    <tr
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{ width: `${cell.column.getSize()}px`, minWidth: `${cell.column.getSize()}px` }}
                          className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Bottom spacer row to maintain accurate scroll height */}
                {paddingBottom > 0 && (
                  <tr>
                    <td
                      style={{ height: `${paddingBottom}px` }}
                      colSpan={table.getVisibleFlatColumns().length}
                    />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
