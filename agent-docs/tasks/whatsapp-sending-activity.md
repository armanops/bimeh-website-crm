## WhatsApp Sending and Activity Logging

### Description

Add functionality to send messages via WhatsApp Web links, log activities, and update lead status to contacted on send.

### Core Logic

- Send button opens wa.me link with message.
- Log button records activity.
- On send/log, set lead status to 'contacted' if applicable.

### Relations to Code Files

- Marketing panel: [`src/app/admin/outreach/messages/page.tsx`](src/app/admin/outreach/messages/page.tsx)
- Actions: New in `/app/admin/outreach/actions/`

### Steps

1. Integrate send and log buttons in outreach panel (separated buttons).
2. Generate WhatsApp link with encoded message and phone.
3. Implement activity logging with status update.
4. Update UI to reflect status changes.

### Tasklist

- [ ] Add send button (wa.me link)
- [ ] Add log activity button
- [ ] Implement status update to contacted on action
- [ ] Update UI status after action
