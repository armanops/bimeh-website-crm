# Admin Dashboard Comprehensive

## Description

Implement a comprehensive Business Intelligence (BI) dashboard in the main admin page (`src/app/admin/page.tsx`), replacing the current blank state. The dashboard should display key metrics including total customers, last activity, latest customer, total messages sent, messages sent today, new customers, and other relevant statistics for the insurance company's outreach and customer management system.

## Core Logic

- Fetch data from database using Drizzle ORM queries
- Display metrics in cards with Persian text and RTL layout
- Use shadcn/ui components for consistent design
- Implement real-time or cached data fetching
- Ensure responsiveness for mobile and desktop
- Include charts or visualizations where appropriate for BI feel
- Handle loading states and error handling with toasts

## Relations to Code Files

- Main dashboard: `src/app/admin/page.tsx`
- Database queries: `src/db/queries/` (e.g., customers, activities, messages)
- Components: `src/components/admin/` for reusable dashboard components
- Schema: `src/db/schema.ts` for understanding data structure
- Existing outreach components: `src/components/admin/outreach/` for reference

## Steps

1. Review existing database schema and queries for available metrics
2. Create new database queries for dashboard metrics if needed
3. Design dashboard layout with metric cards
4. Implement data fetching in the admin page
5. Create dashboard components for displaying metrics
6. Add charts/visualizations for better BI experience
7. Ensure Persian RTL support and responsiveness
8. Test integration with existing admin layout

## Tasklist

- [ ] Review database schema and existing queries
- [ ] Create dashboard metric queries in `/db/queries/dashboard.ts`
- [ ] Design dashboard layout in `src/app/admin/page.tsx`
- [ ] Implement metric cards component
- [ ] Add data fetching logic
- [ ] Integrate charts/visualizations
- [ ] Ensure RTL and responsive design
- [ ] Final testing and cleanup
