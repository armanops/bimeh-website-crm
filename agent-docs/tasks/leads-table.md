## Leads Table

### Description

Create a table page for viewing and managing leads in the admin panel. Include search, pagination, and actions for leads data.

### Core Logic

- Fetch leads from the database using Drizzle queries.
- Display data in a table using Tanstack Table with columns for Name, Phone, Insurance Type, Status, Actions.
- Implement search functionality to filter by name or phone.
- Add pagination for handling large datasets.
- Support actions like view, edit, or convert to customer.

### Relations to Code Files

- Database schema: [`src/db/schema.ts`](src/db/schema.ts)
- Database queries: [`src/db/queries/leads.ts`](src/db/queries/leads.ts)
- Page: [`src/app/admin/leads-table/page.tsx`](src/app/admin/leads-table/page.tsx)
- Table component: [`src/components/ui/table.tsx`](src/components/ui/table.tsx)

### Steps

1. Create the leads table page at `src/app/admin/leads-table/page.tsx`.
2. Implement data fetching from leads table.
3. Integrate Tanstack Table for data display.
4. Add search bar for filtering.
5. Implement pagination.
6. Add table actions (view/edit).

### Tasklist

- [ ] Create leads table page
- [ ] Fetch leads data from database
- [ ] Integrate Tanstack Table
- [ ] Add search functionality
- [ ] Implement pagination
- [ ] Add table actions
