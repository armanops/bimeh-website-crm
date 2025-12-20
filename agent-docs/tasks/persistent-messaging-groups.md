# Persistent Messaging Groups

## Description

Implement database-backed messaging groups to persist group data across sessions. Allow creation of multiple groups, adding users (leads/customers) to multiple groups, and manual management of groups and their members through a dedicated interface.

## Core Logic

- Create database tables: `groups` and `group_members` for many-to-many relationship
- Groups can contain both leads and customers
- Users can belong to multiple groups
- Add group management UI in admin panel
- Update messaging store to work with persistent groups
- Maintain existing selection workflow but with save/load functionality

## Relations to Code Files

- [`src/db/schema.ts`](src/db/schema.ts) - Add groups and group_members tables
- [`src/db/queries/groups.ts`](src/db/queries/groups.ts) - New queries for group operations
- [`src/lib/stores/messaging-store.ts`](src/lib/stores/messaging-store.ts) - Update to work with persistent groups
- [`src/components/admin/outreach/messages-panel.tsx`](src/components/admin/outreach/messages-panel.tsx) - Update group display and management
- [`src/app/admin/outreach/groups/`](src/app/admin/outreach/groups/) - New group management pages
- [`src/app/admin/outreach/actions.ts`](src/app/admin/outreach/actions.ts) - Add group management actions

## Steps

1. Update database schema with groups and group_members tables
2. Create group queries and actions
3. Create group management UI pages
4. Update messaging store to load/save groups
5. Update messages panel to work with persistent groups
6. Add group selection and management in messages panel
7. Test full group lifecycle (create, add users, send messages, delete)

## Tasklist

- [ ] Update database schema for groups
- [ ] Create group queries and actions
- [ ] Create group management UI
- [ ] Update messaging store for persistence
- [ ] Update messages panel for group management
- [ ] Add group selection in messages panel
- [ ] Test group lifecycle operations
