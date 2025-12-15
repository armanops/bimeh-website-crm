# Make Website Persian

## Description

Translate all user-facing text in the BIM760 website to Persian. Ensure RTL layout support throughout the application, including admin panels, public pages, and components. Update navigation, forms, buttons, labels, and content to Persian.

## Core Logic

- Use Persian text for all UI elements (buttons, labels, navigation, etc.)
- Ensure proper RTL (right-to-left) layout using Tailwind classes like `dir="rtl"`
- Maintain English for code comments, variable names, and internal logic
- Update all pages, components, and layouts
- Test for proper display and layout

## Relations to Code Files

- `src/app/layout.tsx`: Root layout for RTL direction
- `src/app/admin/layout.tsx`: Admin layout
- All page components in `src/app/`
- Components in `src/components/`
- Sidebar and other UI components

## Steps

1. Update root layout for RTL
2. Translate admin sidebar navigation
3. Translate admin pages content
4. Translate public pages
5. Update components and forms
6. Test RTL layout

## Tasklist

- [x] Update root layout for RTL
- [x] Translate admin sidebar
- [x] Translate admin pages
- [x] Translate public pages
- [x] Update components
- [x] Test layout
