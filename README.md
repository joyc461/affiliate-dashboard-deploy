# Affiliate Reports Mini-Dashboard

A simple affiliate reporting dashboard built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Table**, and **TanStack Virtual**. The application renders and filters 10,000 affiliate records smoothly without using pagination.

## Getting Started

**Recommended Node version:** v20+

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

The **Admin / Viewer** role toggle is available in the top-right corner of the dashboard.

---

**Tested Performance Benchmarks:**

We have run the performance tests locally to measure the exact production build time and application load time. The results are as follows:

- **Production Build Time (`npm run build`):** **1,784ms** (~1.78s compile time; **601ms** static page generation).
- **App Start / Page Load Time:** **~130ms – 210ms** initial HTTP response and load time.
---

# Architecture & Design Decisions

## 1. Rendering

### What runs on the server vs the client in your setup, and why? Where does the data get loaded?

We generate and load the 10,000-row dataset once on the server in `app/page.tsx` and pass it down to the dashboard as props. All interactive features—like search, sorting, table rendering, and role switching—run on the client because they rely on React state and browser events. This setup keeps initial loading fast and eliminates extra client-side data fetching.

---

## 2. Performance

### How did you make 10,000 rows stay smooth? What did you measure, and what did you deliberately not do?

We kept 10,000 rows smooth by using TanStack Virtual to only render the ~25 rows visible on screen instead of attaching 10,000 DOM nodes. We paired the global search box with `useDeferredValue` so typing never lags while the table updates in the background. We have avoided pagination to fulfill the requirement of showing all rows.
---

## 3. Authorization

### Where is the role gate enforced? Which parts are column-level vs row-level, and what would you move server-side in production — and why cant the frontend be trusted alone?

The role gate is managed via React state at the top of the dashboard. For row-level security, Viewers only see EU records and flagged rows are removed; for column-level security, the Revenue column is hidden in the table and locked in the top Summary Bar. In production, these authorization rules must be enforced on the backend database or API because frontend code and network payloads can easily be inspected or modified by users.

---

## 4. State & Filtering

### How is filter / sort state managed, and how did you avoid unnecessary re-renders as the user types and sorts?

We manage filter, sort, and role state using standard React `useState`. To prevent unnecessary re-renders, we wrapped the heavy table filtering and Summary Bar KPI calculations in `useMemo`, and defined table columns outside the component render loop. We also used `useDeferredValue` on the search input to keep typing smooth and responsive.

---

## 5. Trade-offs & Future Improvements

### What did you cut to fit the timebox, and what would you do next with a full day?

To stay within the assignment time limit, we focused on core table performance, architectural cleanliness, and virtualization over extra features. Given a full workday, we would sync filter/sort state to URL query parameters (`?search=...&role=...`), add CSV/Excel export functionality, improve keyboard accessibility, server side pagination and add automated unit and end-to-end tests.

---

# Libraries and Framework Used

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Table
- TanStack Virtual
- Lucide React

---

# Why TanStack Table?

I chose TanStack Table because it gives full control over the table while keeping the logic separate from the UI.

It works well with TypeScript, is easy to customize, and integrates nicely with TanStack Virtual for handling large datasets efficiently.

---

# Notable Refactorings & Fixes

### 1. Hydration Mismatch Fix (`app/layout.tsx`)
Browser extensions (like screen rulers, Grammarly, or theme tools) often inject inline styles or extra attributes into the `<html>` and `<body>` tags before React finishes loading. This caused a Next.js hydration error because the live browser DOM didn't match the server-rendered HTML. To fix this, we added `suppressHydrationWarning` to the root tags, instructing React to safely ignore extension-injected attributes without masking real bugs in the application.

### 2. Simplifying Styling (Removing `clsx` and `tailwind-merge`)
Many Tailwind projects use a `cn()` helper with `clsx` and `tailwind-merge` to handle complex class overrides. Since our components only perform straightforward class joining without conflicting overrides, we removed both external libraries and deleted `utils/cn.ts`. We now use simple, native JavaScript template literals (e.g., `` `base-class ${className ?? ""}` ``), keeping the project lightweight and dependency-free.

### 3. Eliminating Table Height Flickering on Reload (`components/DataTable.tsx`)
To prevent layout shifts and flickering when reloading the virtualized table, we set an explicit fixed container height (`h-[650px] min-h-[650px]`) and configured `initialRect` in `useVirtualizer` so the browser instantly reserves the exact viewport dimensions before JavaScript executes.

---

# Project Structure

```
app/
components/
hooks/
lib/
types/
utils/
```

- **components** → Reusable UI components
- **hooks** → Data filtering and table logic
- **lib** → Table configuration and helper functions
- **types** → Shared TypeScript types
- **utils** → Shared utility functions (`formatters.ts`)

---

# Why `utils/formatters.ts`?

We use `utils/formatters.ts` to centralize USD currency, number, percentage, and date formatting across table cells and KPI cards using zero-dependency, built-in browser `Intl` APIs with locked UTC/locale settings to ensure visual consistency and prevent hydration mismatch errors.

---
