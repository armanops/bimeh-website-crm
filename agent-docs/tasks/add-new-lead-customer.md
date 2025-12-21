# Add New Lead/Customer Functionality

## Description

Implement functionality in the admin lead and customer panels to allow admins to add new leads or customers. The forms should accept as much data as needed, but require first name and last name. Phone numbers must be unique across all leads and customers.

## Core Logic

- Add "Add New" buttons to leads and customers pages
- Create forms with validation for required fields (first name, last name) and unique phone number
- Use server actions for database operations
- Ensure phone numbers are normalized to international format
- Provide user feedback with toasts
- Support Persian RTL layout

## Relations to Code Files

- [`src/app/admin/outreach/leads/page.tsx`](src/app/admin/outreach/leads/page.tsx:1)
- [`src/app/admin/outreach/customers/page.tsx`](src/app/admin/outreach/customers/page.tsx:1)
- [`src/db/queries/leads.ts`](src/db/queries/leads.ts:1)
- [`src/db/queries/customers.ts`](src/db/queries/customers.ts:1)
- [`src/components/admin/outreach/customer-edit-form.tsx`](src/components/admin/outreach/customer-edit-form.tsx:1)

## Steps

1. Review existing lead and customer pages and forms
2. Add "Add New" button to leads page
3. Add "Add New" button to customers page
4. Create or modify forms to handle new entry creation
5. Implement validation for required fields and phone uniqueness
6. Update database actions to insert new records
7. Add toast notifications for success/error

## Tasklist

- [x] Review existing code structure
- [x] Add Add New button to leads page
- [x] Add Add New button to customers page
- [x] Implement form validation and uniqueness checks
- [x] Update database insertion logic
- [x] Add toast feedback
- [x] Test integration
