## Upload Leads

### Description

Create an admin page for uploading leads from Excel files. The page should allow file selection, upload, parsing, validation, and insertion into the database. Support Persian RTL layout and provide user feedback.

### Core Logic

- Use SheetJS (xlsx) library to parse Excel files.
- Normalize phone numbers to international format (e.g., +98912...).
- Validate required fields and handle duplicates.
- Insert leads into the database using Drizzle ORM.
- Provide progress feedback and error handling with toasts.

### Relations to Code Files

- Database schema: [`src/db/schema.ts`](src/db/schema.ts)
- Database queries: [`src/db/queries/leads.ts`](src/db/queries/leads.ts) (if exists)
- API route: [`src/app/api/admin/outreach/import/route.ts`](src/app/api/admin/outreach/import/route.ts)
- Page: [`src/app/admin/upload-leads/page.tsx`](src/app/admin/upload-leads/page.tsx)

### Steps

1. Create the upload page at `src/app/admin/upload-leads/page.tsx` with file input and upload button.
2. Implement API route `src/app/api/admin/outreach/import/route.ts` for handling multipart form data.
3. Add SheetJS dependency to `package.json` if not present.
4. Parse Excel file, map columns to lead fields, normalize phones.
5. Validate data: check for required fields, unique phones.
6. Insert valid leads into database, handle errors and duplicates.
7. Add progress bar, success/error messages using shadcn/ui toasts.

### Tasklist

- [ ] Create upload page with file input
- [ ] Implement API route for file upload
- [ ] Add SheetJS dependency
- [ ] Parse Excel and map columns
- [ ] Normalize phone numbers
- [ ] Validate data and handle duplicates
- [ ] Insert leads to database
- [ ] Add progress feedback and notifications
