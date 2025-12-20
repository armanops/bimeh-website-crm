# Group Selection for Messaging

## Description

Implement a feature to select multiple leads or customers from the outreach panels, add them to a temporary group, display the selected users in a table within the send message panel, auto-fill message data with the selected user's information when clicked, and allow manual removal of users from the group after sending messages. This enhances the marketing outreach workflow by enabling batch messaging with personalized data filling.

## Core Logic

- Use Zustand store for managing selected users group (array of user objects with id, name, phone, etc.)
- Add selection checkboxes to leads and customers tables
- Display selected group as a table in messages-panel.tsx with remove buttons
- On clicking a user in the group table, populate the message form with their data (name, phone, etc.)
- After sending a message, provide option to remove the user from the group
- Ensure RTL support for Persian text and proper normalization of phone numbers
- Use server actions for sending messages and updating activity history

## Relations to Code Files

- [`src/components/admin/outreach/messages-panel.tsx`](src/components/admin/outreach/messages-panel.tsx) - Main send message panel, add group table and form auto-fill logic
- [`src/app/admin/outreach/leads/page.tsx`](src/app/admin/outreach/leads/page.tsx) - Leads table, add selection checkboxes
- [`src/app/admin/outreach/customers/page.tsx`](src/app/admin/outreach/customers/page.tsx) - Customers table, add selection checkboxes
- [`src/db/queries/leads.ts`](src/db/queries/leads.ts) - Query functions for leads data
- [`src/db/queries/customers.ts`](src/db/queries/customers.ts) - Query functions for customers data
- [`src/app/admin/outreach/actions.ts`](src/app/admin/outreach/actions.ts) - Server actions for messaging and group management
- [`src/db/schema.ts`](src/db/schema.ts) - Database schema, check if group storage needed (likely in-memory via Zustand)

## Steps

1. Review existing messages-panel.tsx and outreach actions for current send message implementation
2. Add Zustand store for selected users group in a new store file under /lib
3. Update leads and customers table components to include selection checkboxes and "Add to Group" button
4. Modify messages-panel.tsx to display selected group table above the message form
5. Implement click handler on group table rows to auto-fill message form fields
6. Add remove button to each group table row for manual removal
7. Update send message action to optionally remove user from group after send
8. Ensure proper error handling, loading states, and toast notifications using sonner
9. Test integration with existing activity logging

## Tasklist

- [ ] Review current messages-panel and outreach actions
- [ ] Create Zustand store for selected users group
- [ ] Add selection checkboxes to leads table
- [ ] Add selection checkboxes to customers table
- [ ] Update messages-panel with group table display
- [ ] Implement form auto-fill on group row click
- [ ] Add remove functionality to group table
- [ ] Update send action for group removal option
- [ ] Add error handling and toasts
- [ ] Test full workflow integration
