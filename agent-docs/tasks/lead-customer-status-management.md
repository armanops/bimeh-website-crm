## Lead and Customer Status Management

### Description

Implement UI controls for managing lead and customer statuses. Add status dropdowns, convert lead to customer button, and contacted button next to WhatsApp send. Automatic status updates on actions.

### Core Logic

- In leads table/page: Status dropdown ('lead', 'contacted'), convert to customer button, contacted button (sets status to contacted, logs activity).
- In customers table/page: Status dropdown ('contacted', 'target', 'active').
- Server actions for status updates and conversions.
- Use sonner for feedback.

### Relations to Code Files

- Leads page: [`src/app/admin/outreach/leads/page.tsx`](src/app/admin/outreach/leads/page.tsx)
- Customers page: [`src/app/admin/outreach/customers/page.tsx`](src/app/admin/outreach/customers/page.tsx)
- Queries: [`src/db/queries/leads.ts`](src/db/queries/leads.ts), [`src/db/queries/customers.ts`](src/db/queries/customers.ts)
- Actions: New in `/app/admin/outreach/actions/`

### Steps

1. Update leads page with status dropdown and buttons.
2. Update customers page with status dropdown.
3. Create server actions for status updates and conversions.
4. Integrate contacted button with activity logging.

### Tasklist

- [x] Add status dropdown to leads table
- [x] Add convert to customer button to leads
- [x] Add contacted button to leads with activity logging
- [x] Add status dropdown to customers table
- [x] Create server actions for updates
- [x] Test status transitions
