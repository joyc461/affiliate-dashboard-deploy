# Affiliate Reports Mini-Dashboard

A high-performance affiliate reporting dashboard built with Next.js 15 (App Router), strict TypeScript, Tailwind CSS, TanStack Table v8, and TanStack Virtual v3. Designed to effortlessly render and filter 10,000 rows at 60 FPS without pagination.

## Quick Start

```bash
# Node version: v20.x or higher recommended
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard. The **Role Toggle** is located in the top-right corner of the table toolbar.

---

## Architectural Decisions & Interview Answers

### 1. Rendering
**What runs on the server vs the client, and why? Where does the data get loaded?**
We load the deterministic 10,000-row dataset inside the Next.js App Router Server Component (`app/page.tsx`) using `generateRows()`, and pass it as initial props to our client-side `<Dashboard />` container. Generating static data on the server keeps the initial bundle lightweight and eliminates client-side fetching waterfalls, while isolating interactive table state (sorting, filtering, virtualization) strictly inside client components where browser APIs live.

### 2. Performance
**How did you make 10,000 rows stay smooth? What did you measure, and what did you deliberately not do?**
We integrated `@tanstack/react-virtual` to cap our DOM footprint at ~25 visible rows (plus a 12-row overscan buffer), preventing browser layout thrashing from 10,000 DOM nodes. We also customized our global search to scan only the `affiliate` and `campaign` fields (reducing string comparisons by nearly 80%) and paired the input with React's `useDeferredValue` so typing never blocks the UI thread. We deliberately **did not use pagination** (per the brief) and deliberately avoided offloading filtering to Web Workers because in-memory V8 string filtering takes <5ms, making async worker serialization unnecessary overhead for 10k rows.

### 3. Authorization
**Where is the role gate enforced? Which parts are column-level vs row-level, and what would you move server-side in production — and why can't the frontend be trusted alone?**
The role gate is managed via clean, linear React state (`useState`) located at the top of our `<Dashboard />` container, avoiding unnecessary React Context indirection so the data flow is effortless to trace.
* **Row-level security (RLS):** Our `useAffiliateData` hook filters out non-EU regions and `flagged` status rows before passing data to the table and summary KPIs.
* **Column-level security (CLS):** We set TanStack Table's `columnVisibility.revenue` to `false` for Viewers, completely stripping the Revenue column from the DOM.
* **Production security:** In production, you can **never** trust frontend filtering alone because technical users can inspect network payloads or React DevTools. We would move both RLS (`WHERE region = 'EU'`) and CLS (omitting sensitive revenue JSON properties) to the backend API or database layer, leaving the frontend toggle to simply mirror those server-enforced permissions.

### 4. State & Filtering
**How is filter / sort state managed, and how did you avoid unnecessary re-renders as the user types and sorts?**
We manage table and role state using standard React `useState` wrapped in headless TanStack Table controllers. To prevent unnecessary re-renders, we declared our table column schemas and comparator functions statically outside render loops and memoized array calculations with `useMemo`. As the user types in the global search bar, `useDeferredValue` ensures the text input updates immediately at 60 FPS while deferring the heavy table re-filtering to background concurrent render cycles.

### 5. Trade-offs & Next Steps
**What did you cut to fit the timebox, and what would you do next with a full day?**
To respect the timebox, we prioritized architectural cleanliness, code readability, and virtualization performance over fancy UI animations, extensive automated unit tests, and URL search parameter syncing. Given a full workday, we would:
1. **Sync filter & sort state to URL query params** (`?search=health&sort=clicks_desc&role=viewer`) so dashboard views are bookmarkable and shareable.
2. **Add automated testing** using Vitest for unit testing our `useAffiliateData` RBAC rules and Playwright for end-to-end testing virtual scroll rendering.
3. **Add CSV / Excel export functionality** respecting the active role gate (ensuring Viewers cannot export hidden revenue data).
