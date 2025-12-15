## Export Data

### Description

Implement export functionality to download leads, customers, and activity history as Excel files from the admin panel.

### Core Logic

- Create API routes to fetch data and generate Excel files using SheetJS.
- Support exporting all or selected records.
- Ensure phone numbers are in international format.
- Provide download links or direct file downloads.

### Relations to Code Files

- Database schema: [`src/db/schema.ts`](src/db/schema.ts)
- Database queries: [`src/db/queries/leads.ts`](src/db/queries/leads.ts), [`src/db/queries/customers.ts`](src/db/queries/customers.ts), [`src/db/queries/activities.ts`](src/db/queries/activities.ts)
- API routes: [`src/app/api/admin/export/leads/route.ts`](src/app/api/admin/export/leads/route.ts), etc.
- Page: [`src/app/admin/export-data/page.tsx`](src/app/admin/export-data/page.tsx)

### Steps

1. Create export data page at `src/app/admin/export-data/page.tsx` with options for data type.
2. Implement API routes for exporting leads, customers, and activities.
3. Use SheetJS to generate Excel files from database data.
4. Add export buttons in table pages.
5. Handle selected exports for history.

### Tasklist

- [ ] Create export data page
- [ ] Implement export API for leads
- [ ] Implement export API for customers
- [ ] Implement export API for activity history
- [ ] Add export buttons in UI
- [ ] Support selected exports
