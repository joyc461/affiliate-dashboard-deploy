import React from "react";
import { generateRows } from "@/lib/affiliate-data";
import { Dashboard } from "@/components/Dashboard";

export default async function DashboardPage() {
  const initialRows = generateRows(10000);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Affiliate Reports Mini-Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                High-performance 10,000-row table with real-time global filtering, multi-type sorting, and RBAC role gating.
              </p>
            </div>
          </div>
        </div>
        <Dashboard initialData={initialRows} />
      </div>
    </main>
  );
}
