# Customer Data Control

## Description

Implement full control over customer data in the admin outreach panel. After clicking on a customer from the customers table, navigate to a dedicated customer page that displays a preview of all available customer data. Provide a form to fully customize all customer fields, allowing users to change as many fields as desired. Include form validation and submit all changes on form submission.

## Core Logic

- Customer page should display all customer data in a read-only preview initially.
- Include an edit button to bring up a form with all editable fields.
- Form should support editing multiple fields simultaneously.
- Implement client-side and server-side validation.
- On submit, update the customer data in the database and show success feedback.
- Ensure all text is in Persian and supports RTL layout.
- Use server actions for data updates to maintain security.

## Relations to Code Files

- `src/app/admin/outreach/customers/page.tsx`: Existing customers table page.
- `src/app/api/admin/outreach/customers/[id]/route.ts`: API route for customer operations.
- `src/db/queries/customers.ts`: Database queries for customers.
- `src/db/schema.ts`: Database schema for customers table.
- `components/admin/outreach/`: Existing outreach components for reference.

## Steps

1. Create a new page at `src/app/admin/outreach/customers/[id]/page.tsx` for individual customer details.
2. Implement a preview component to display customer data.
3. Create an edit form component with all customer fields.
4. Add form validation using appropriate libraries (e.g., react-hook-form with zod).
5. Implement server action for updating customer data.
6. Update navigation from customers table to the new detail page.
7. Ensure RTL support and Persian text throughout.

## Tasklist

- [ ] Create customer detail page component
- [ ] Implement data preview display
- [ ] Create editable form with all fields
- [ ] Add form validation
- [ ] Implement server action for updates
- [ ] Update navigation links
- [ ] Test RTL and Persian support
