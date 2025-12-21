# Group Selection Messaging Enhancement

## Description

Enhance the group selection functionality within the sending message panel to allow users to select a group, click on individual users to pre-fill the send panel with preview and all necessary details, delete users from the group directly, and change group assignments. Additionally, implement add and remove people functionality in the group management panel, consistent with other sections of the application.

## Core Logic

- In the sending message panel, integrate group selection that displays group members.
- On clicking a user in the group, pre-populate the send panel with user details, message preview, and any required fields.
- Provide inline actions for deleting users from the group and changing their group assignments directly from the selection interface.
- In the group management panel, add UI elements to add new people to groups and remove existing members, using similar patterns as other admin sections (e.g., leads/customers management).
- Ensure all actions are server-side, use proper validation, and provide user feedback via toasts.
- Maintain Persian RTL support and responsive design.

## Relations to Code Files

- [`components/admin/outreach/group-selection-dialog.tsx`](components/admin/outreach/group-selection-dialog.tsx) - Existing group selection dialog to enhance with user actions.
- [`components/admin/outreach/messages-panel.tsx`](components/admin/outreach/messages-panel.tsx) - Sending message panel to integrate group selection and pre-fill logic.
- [`src/app/admin/outreach/groups/page.tsx`](src/app/admin/outreach/groups/page.tsx) - Group management page to add add/remove functionality.
- [`src/app/admin/outreach/actions.ts`](src/app/admin/outreach/actions.ts) - Server actions for group and user management.
- [`src/db/queries/leads.ts`](src/db/queries/leads.ts) - Database queries for leads/groups if needed.
- [`src/app/api/admin/outreach/groups/[id]/route.ts`](src/app/api/admin/outreach/groups/[id]/route.ts) - API routes for group operations.

## Steps

1. Review existing group selection dialog and messages panel components for integration points.
2. Update group selection dialog to display users with click handlers for pre-filling send panel.
3. Add delete and change group actions to user items in the dialog.
4. Modify messages panel to handle group selection and user pre-fill functionality.
5. Enhance group management page with add/remove people UI, using existing patterns.
6. Implement server actions and API updates for add/remove operations.
7. Test integration and ensure Persian RTL and responsiveness.

## Tasklist

- [ ] Review existing components and identify integration points
- [ ] Enhance group selection dialog with user actions (pre-fill, delete, change group)
- [ ] Update messages panel for group selection and pre-fill logic
- [ ] Add add/remove people functionality to group management panel
- [ ] Implement server-side actions and API updates
- [ ] Test and verify functionality
