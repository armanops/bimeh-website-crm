## Marketing Outreach Panel

### Description

Build a panel for composing and sending WhatsApp messages. Select template, choose lead/customer, auto-fill variables, preview message, send via wa.me link, and log activity.

### Core Logic

- Dropdown for template selection.
- Search/select recipient by phone or name.
- Auto-replace {{fieldName}} in template with recipient data.
- Preview message.
- Send button: opens wa.me with encoded message.
- Log button: records activity in database.
- Persian RTL support.

### Relations to Code Files

- Page: [`src/app/admin/outreach/messages/page.tsx`](src/app/admin/outreach/messages/page.tsx) (update existing)
- Components: New in `/components/admin/outreach/`
- Actions: New in `/app/admin/outreach/actions/`

### Steps

1. Update message panel page for template selection.
2. Add recipient selection.
3. Implement variable replacement preview.
4. Add send and log buttons with actions.
5. Integrate with existing AI features if needed.

### Tasklist

- [ ] Update message panel page
- [ ] Add template dropdown
- [ ] Add recipient search/select
- [ ] Implement message preview with variables
- [ ] Add send button (wa.me link)
- [ ] Add log activity button
- [ ] Test full flow
