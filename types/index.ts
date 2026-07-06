import { AffiliateRow, Role } from "@/lib/affiliate-data";

/**
 * Filter state representing the global search query across Affiliate and Campaign.
 */
export interface FilterState {
  globalSearch: string;
}

/**
 * Summary metrics calculated for the currently visible (authorized & filtered) rows.
 */
export interface DashboardSummary {
  totalRows: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number | null; // null when hidden for Viewer role
  avgConversionRate: number;
}

/**
 * Props for the main Dashboard container
 */
export interface DashboardProps {
  initialData: AffiliateRow[];
}
