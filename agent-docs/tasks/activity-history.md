## Activity History

### Description

Implement a table to view all outreach activities with filtering options. Display sent messages, AI-generated status, and timestamps.

### Core Logic

- Fetch activity data from the activities table using Drizzle.
- Use Tanstack Table for display with columns for Customer, Message, AI Generated, Sent At, Sent By.
- Implement filters for customer name/phone and date range.
- Ensure RTL support for Persian text in messages.

### Relations to Code Files

- Database schema: [`src/db/schema.ts`](src/db/schema.ts)
- Database queries: [`src/db/queries/activities.ts`](src/db/queries/activities.ts)
- Page: [`src/app/admin/activity-history/page.tsx`](src/app/admin/activity-history/page.tsx)
- Table component: [`src/components/ui/table.tsx`](src/components/ui/table.tsx)

### Steps

1. Create activity history page at `src/app/admin/activity-history/page.tsx`.
2. Build table with columns: Customer Name/Phone, Message Snippet, AI Generated?, Sent At, Sent By.
3. Add filters by customer or date.
4. Fetch data from activities table.

### Tasklist

- [ ] Create activity history page
- [ ] Implement table with Tanstack Table
- [ ] Add filtering options
- [ ] Fetch and display activity data
