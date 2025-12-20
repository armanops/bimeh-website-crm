## Activity Panels Enhancement

### Description

Enhance activity history with separate panels for lead and customer activities. Add filters for created date, phone, name. Display full message text and related data.

### Core Logic

- Update activity history page with tabs or sections for leads and customers.
- Add filters: date range, phone, name.
- Columns: Phone, Name, Message (full), Sent At, Status, etc.
- Fetch from activities table, joining leads/customers.

### Relations to Code Files

- Page: [`src/app/admin/activity-history/page.tsx`](src/app/admin/activity-history/page.tsx)
- Queries: [`src/db/queries/activities.ts`](src/db/queries/activities.ts)

### Steps

1. Update activity history page with tabs.
2. Add filter controls.
3. Enhance table columns.
4. Implement filtering logic.

### Tasklist

- [ ] Add tabs for lead and customer activities
- [ ] Implement filters (date, phone, name)
- [ ] Update table to show full message
- [ ] Add related data columns
- [ ] Test filtering and display
