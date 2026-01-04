# Lead Source Preservation for Customers

## Description

Add a source field to the customer table to preserve the lead source information when leads are converted to customers. The source field should be editable by users and should automatically inherit the source from the lead when a lead is converted to a customer.

## Core Logic

1. Add a `source` field to the `customersTable` schema that can store the source information from leads
2. Modify the `convertLeadToCustomer` function to copy the source from the lead to the customer
3. Update the customer form and API to include the source field
4. Ensure the source field is displayed and editable in the customer detail view

## Relations to Code Files

- `src/db/schema.ts` - Add source field to customersTable
- `src/db/queries/customers.ts` - Update convertLeadToCustomer function
- `src/components/admin/outreach/customer-edit-form.tsx` - Add source field to form
- `src/app/admin/outreach/customers/[id]/page.tsx` - Display source field in customer detail
- `src/app/api/admin/outreach/customers/route.ts` - Update API to handle source field

## Steps

1. Add `source` field to customersTable schema in src/db/schema.ts
2. Update the convertLeadToCustomer function to copy source from lead
3. Add source field to customer form schema and UI
4. Update customer detail page to display source field
5. Update API routes to handle source field in create/update operations
6. Update TypeScript types to include source field

## Tasklist

- [ ] Add source field to customersTable schema
- [ ] Update convertLeadToCustomer function to preserve source
- [ ] Add source field to customer form schema and UI
- [ ] Display source field in customer detail view
- [ ] Update API routes to handle source field
- [ ] Update TypeScript types for source field
