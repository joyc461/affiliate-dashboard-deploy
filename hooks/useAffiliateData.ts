import { useMemo } from "react";
import { AffiliateRow, Role } from "@/lib/affiliate-data";

/**
 * Simple hook that applies Row-Level Security (RLS) based on the active role.
 * - Admin: Sees all rows.
 * - Viewer: Sees only EU region and non-flagged rows.
 */
export function useAffiliateData(initialData: AffiliateRow[], role: Role): AffiliateRow[] {
  return useMemo(() => {
    if (role === "admin") return initialData;

    return initialData.filter((row) => row.region === "EU" && row.status !== "flagged");
  }, [initialData, role]);
}
