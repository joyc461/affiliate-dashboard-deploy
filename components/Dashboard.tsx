"use client";

import React, { useState, useDeferredValue, useCallback } from "react";
import { AffiliateRow, Role } from "@/lib/affiliate-data";
import { useAffiliateData } from "@/hooks/useAffiliateData";
import { TableToolbar } from "./TableToolbar";
import { SummaryBar } from "./SummaryBar";
import { DataTable } from "./DataTable";

export interface DashboardProps {
  initialData: AffiliateRow[];
}

/**
 * Main entry point for the Affiliate Reports Dashboard.
 * State management lives cleanly right here via standard React useState.
 */
export function Dashboard({ initialData }: DashboardProps) {
  const [role, setRole] = useState<Role>("admin");
  const [searchQuery, setSearchQuery] = useState("");

  // Decouple input rendering from heavy array filtering via useDeferredValue
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Apply Row-Level Security (RLS) rules
  const authorizedRows = useAffiliateData(initialData, role);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="space-y-6">
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredCount={authorizedRows.length}
        totalCount={initialData.length}
        role={role}
        setRole={setRole}
      />

      <SummaryBar rows={authorizedRows} role={role} />

      <DataTable
        data={authorizedRows}
        role={role}
        globalFilter={deferredSearchQuery}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
