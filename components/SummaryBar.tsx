"use client";

import React, { useMemo } from "react";
import { Users, MousePointerClick, TrendingUp, DollarSign, Lock } from "lucide-react";
import { AffiliateRow, Role } from "@/lib/affiliate-data";
import { MetricCard } from "./MetricCard";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters";

export interface SummaryBarProps {
  rows: AffiliateRow[];
  role: Role;
}

/**
 * Calculates and renders high-level KPI aggregations for the currently visible rows.
 * Viewers cannot see total revenue.
 */
export function SummaryBar({ rows, role }: SummaryBarProps) {
  const isAdmin = role === "admin";

  const metrics = useMemo(() => {
    let totalClicks = 0;
    let totalConversions = 0;
    let totalRevenue = 0;

    for (const row of rows) {
      totalClicks += row.clicks;
      totalConversions += row.conversions;
      totalRevenue += row.revenue;
    }

    const avgConversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0;

    return {
      totalRows: rows.length,
      totalClicks,
      totalConversions,
      totalRevenue: isAdmin ? totalRevenue : null,
      avgConversionRate,
    };
  }, [rows, isAdmin]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Active Affiliates / Rows"
        value={formatNumber(metrics.totalRows)}
        subtitle={!isAdmin ? "Filtered to EU Region only" : "All global campaigns"}
        icon={<Users className="w-5 h-5" />}
      />

      <MetricCard
        title="Total Clicks"
        value={formatNumber(metrics.totalClicks)}
        subtitle="Aggregated traffic"
        icon={<MousePointerClick className="w-5 h-5" />}
      />

      <MetricCard
        title="Avg Conversion Rate"
        value={formatPercentage(metrics.avgConversionRate)}
        subtitle={`${formatNumber(metrics.totalConversions)} total conversions`}
        icon={<TrendingUp className="w-5 h-5" />}
      />

      {isAdmin ? (
        <MetricCard
          title="Total Revenue (Admin Only)"
          value={formatCurrency(metrics.totalRevenue)}
          subtitle="Gross earnings generated"
          icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          valueClassName="text-emerald-600 dark:text-emerald-400"
        />
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-between text-slate-400">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-sm font-semibold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
              Restricted to Admin Role
            </p>
            <p className="text-xs text-slate-400">
              Switch role gate to Admin to view
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-600 dark:text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
}
