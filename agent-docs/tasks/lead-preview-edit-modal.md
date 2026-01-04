# Lead Preview Edit Modal

## Description

Implement a modal dialog to edit lead details directly from the lead preview table. The modal should allow users to modify any aspect of an uploaded lead including name, phone, product, source, and status. This enhances the user experience by providing inline editing capabilities without leaving the preview table.

## Core Logic

- Create a reusable lead edit modal component following existing patterns (similar to `customer-edit-form.tsx`)
- Modal should be triggered by an edit icon in each row of the lead preview table
- Form validation should match the existing lead schema and validation rules
- Support for all lead fields: firstName, lastName, fullName, phone, productId, source, status
- Integration with existing product fetching and selection
- Proper error handling and success feedback using sonner

## Relations to Code Files

- [`components/admin/outreach/lead-preview-table.tsx`](components/admin/outreach/lead-preview-table.tsx) - Main table component where edit icon needs to be added
- [`src/components/admin/outreach/lead-add-form.tsx`](src/components/admin/outreach/lead-add-form.tsx) - Reference for form structure and validation
- [`src/components/admin/outreach/customer-edit-form.tsx`](src/components/admin/outreach/customer-edit-form.tsx) - Reference for edit form patterns
- [`src/components/admin/outreach/group-selection-dialog.tsx`](src/components/admin/outreach/group-selection-dialog.tsx) - Reference for modal dialog patterns
- [`src/db/schema.ts`](src/db/schema.ts) - Lead schema definition
- [`src/app/admin/outreach/leads/[id]/route.ts`](src/app/admin/outreach/leads/[id]/route.ts) - API endpoint for updating leads

## Steps

1. Create `lead-edit-modal.tsx` component in `src/components/admin/outreach/`
2. Add edit icon button to each row in `lead-preview-table.tsx`
3. Implement modal state management in the table component
4. Create form validation schema for lead editing
5. Implement API call to update lead details
6. Add proper error handling and success notifications
7. Ensure responsive design and accessibility

## Tasklist

- [x] Create lead edit modal component with form fields
- [x] Add edit icon to lead preview table rows
- [x] Implement modal state management (open/close)
- [x] Create form validation using zod schema
- [x] Implement PUT API call for updating leads
- [x] Add error handling and success notifications
- [x] Test modal functionality with sample data
- [x] Ensure responsive design and accessibility compliance
