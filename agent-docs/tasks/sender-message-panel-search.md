# Sender Message Panel Search Enhancement

## Description

Enhance the sender message panel in the admin outreach section to allow admins to search for recipients by name, last name, or phone number in addition to the existing dropdown selection. This will improve usability when dealing with large lists of leads or customers.

## Core Logic

- The current messages-panel.tsx likely has a dropdown for selecting recipients (leads/customers).
- Add a search input field above or integrated with the dropdown.
- Implement client-side filtering that matches the search term against first name, last name, or phone number.
- Use debounced search for performance.
- Ensure the search is case-insensitive and supports partial matches.
- Maintain existing dropdown functionality while adding search capability.

## Relations to Code Files

- [`components/admin/outreach/messages-panel.tsx`](components/admin/outreach/messages-panel.tsx:1) - Main component for the sender message panel
- [`src/db/queries/customers.ts`](src/db/queries/customers.ts:1) - Queries for customer data
- [`src/db/queries/leads.ts`](src/db/queries/leads.ts:1) - Queries for lead data
- [`src/components/ui/input.tsx`](src/components/ui/input.tsx:1) - UI component for search input

## Steps

1. Review the current implementation of messages-panel.tsx to understand the dropdown structure and data fetching.
2. Add a search input component using shadcn/ui Input.
3. Implement state management for search term and filtered recipients.
4. Add filtering logic to match search term against name, last name, and phone number.
5. Update the dropdown to display filtered results.
6. Test the search functionality with various inputs.

## Tasklist

- [x] Review current messages-panel.tsx implementation
- [x] Add search input component to the panel
- [x] Implement search state and filtering logic
- [x] Update dropdown to use filtered data
- [x] Test search functionality
