## Customers Table

### Description

Create a table page for viewing and managing customers in the admin panel. Include search, pagination, and actions for customers data.

### Core Logic

- Fetch customers from the database using Drizzle queries.
- Display data in a table using Tanstack Table with columns for Name, Phone, Insurance Type, Status, Actions.
- Implement search functionality to filter by name or phone.
- Add pagination for handling large datasets.
- Support actions like view, edit, or manage policies.

### Relations to Code Files

- Database schema: [`src/db/schema.ts`](src/db/schema.ts)
- Database queries: [`src/db/queries/customers.ts`](src/db/queries/customers.ts)
- Page: [`src/app/admin/customers-table/page.tsx`](src/app/admin/customers-table/page.tsx)
- Table component: [`src/components/ui/table.tsx`](src/components/ui/table.tsx)

### Steps

1. Create the customers table page at `src/app/admin/customers-table/page.tsx`.
2. Implement data fetching from customers table.
3. Integrate Tanstack Table for data display.
4. Add search bar for filtering.
5. Implement pagination.
6. Add table actions (view/edit).

### Tasklist

- [ ] Create customers table page
- [ ] Fetch customers data from database
- [ ] Integrate Tanstack Table
- [ ] Add search functionality
- [ ] Implement pagination
- [ ] Add table actions
