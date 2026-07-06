// affiliate-data.ts
// ---------------------------------------------------------------------------
// Synthetic dataset for the InsightsTap take-home. Deterministic on purpose —
// everyone gets the same 10,000 rows, so results are reproducible.
// Drop this file into your project as-is. Do NOT change the row shape.
// ---------------------------------------------------------------------------

export type AffiliateRow = {
  id: string;
  affiliate: string;
  campaign: string;
  region: "NA" | "EU" | "APAC" | "LATAM";
  clicks: number;
  conversions: number;
  revenue: number;        // SENSITIVE — admin-only (see role rules in the brief)
  status: "active" | "paused" | "flagged";
  updatedAt: string;      // ISO date, e.g. "2024-07-14"
};

const CAMPAIGNS = ["HealthPlus", "RxDirect", "CareConnect", "VitaTrack", "MediRewards", "WellNow"];
const REGIONS = ["NA", "EU", "APAC", "LATAM"] as const;
const STATUSES = ["active", "paused", "flagged"] as const;

// mulberry32 — tiny deterministic PRNG so the dataset is identical for everyone.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateRows(count = 10000): AffiliateRow[] {
  const rand = mulberry32(42);
  const rows: AffiliateRow[] = [];
  const start = Date.UTC(2024, 0, 1);
  for (let i = 0; i < count; i++) {
    const clicks = Math.floor(rand() * 5000);
    const conversions = Math.floor(clicks * (rand() * 0.15));
    const revenue = Math.round(conversions * (5 + rand() * 95) * 100) / 100;
    const region = REGIONS[Math.floor(rand() * REGIONS.length)];
    const status = STATUSES[Math.floor(rand() * STATUSES.length)];
    const dayOffset = Math.floor(rand() * 365);
    rows.push({
      id: `AFF-${100000 + i}`,
      affiliate: `Affiliate ${1000 + Math.floor(rand() * 9000)}`,
      campaign: CAMPAIGNS[Math.floor(rand() * CAMPAIGNS.length)],
      region,
      clicks,
      conversions,
      revenue,
      status,
      updatedAt: new Date(start + dayOffset * 86_400_000).toISOString().slice(0, 10),
    });
  }
  return rows;
}

// The "logged-in user" for the role gate. No real auth is required — the brief
// asks you to expose a simple in-UI toggle between these two roles.
export const VIEWER_REGION = "EU" as const;
export type Role = "admin" | "viewer";
