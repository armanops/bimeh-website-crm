# Full Name Implementation for Leads and Customers

## Description

Implement a comprehensive full name system across the BIM760 insurance platform. This involves adding a `fullName` column to both leads and customers tables, updating the Excel import functionality to handle various full name column headers, and ensuring all tables with first/last name fields also include the fullName field.

## Core Logic

1. **Database Schema Changes**: Add `fullName` column to both `leadsTable` and `customersTable` in the Drizzle schema
2. **Excel Import Enhancement**: Update the import logic to recognize various full name column headers (fullName, نام و نام خانوادگی, نام کامل, etc.)
3. **Data Processing**: When importing, if fullName is provided, extract first and last names from it; if separate names are provided, construct fullName
4. **Form Updates**: Update customer edit form to include fullName field
5. **API Updates**: Ensure all API endpoints handle the new fullName field
6. **UI Updates**: Update leads and customers tables to display fullName
7. **Manual Source Input**: Add UI field to manually set source for all leads during upload

## Relations to Code Files

### Database Schema

- [`src/db/schema.ts`](src/db/schema.ts) - Add fullName columns to leadsTable and customersTable

### Excel Import Logic

- [`src/app/api/admin/outreach/import/route.ts`](src/app/api/admin/outreach/import/route.ts) - Update column mapping and data processing
- [`src/app/admin/upload-leads/page.tsx`](src/app/admin/upload-leads/page.tsx) - Update UI for full name handling
- [`src/components/admin/outreach/lead-preview-table.tsx`](src/components/admin/outreach/lead-preview-table.tsx) - Update preview table

### Forms and UI

- [`src/components/admin/outreach/customer-edit-form.tsx`](src/components/admin/outreach/customer-edit-form.tsx) - Add fullName field
- [`src/app/admin/outreach/leads/page.tsx`](src/app/admin/outreach/leads/page.tsx) - Update leads table display
- [`src/app/admin/outreach/customers/page.tsx`](src/app/admin/outreach/customers/page.tsx) - Update customers table display

### API Endpoints

- [`src/app/api/admin/outreach/leads/route.ts`](src/app/api/admin/outreach/leads/route.ts) - Update leads API
- [`src/app/api/admin/outreach/leads/[id]/route.ts`](src/app/api/admin/outreach/leads/[id]/route.ts) - Update leads detail API
- [`src/app/api/admin/outreach/customers/route.ts`](src/app/api/admin/outreach/customers/route.ts) - Update customers API
- [`src/app/api/admin/outreach/customers/[id]/route.ts`](src/app/api/admin/outreach/customers/[id]/route.ts) - Update customers detail API

### Utility Functions

- [`src/lib/phone-utils.ts`](src/lib/phone-utils.ts) - May need name parsing utilities
- [`src/lib/phone-validation.ts`](src/lib/phone-validation.ts) - May need name validation

## Steps

### 1. Database Schema Updates

- [ ] Add `fullName` column to `leadsTable` in [`src/db/schema.ts`](src/db/schema.ts)
- [ ] Add `fullName` column to `customersTable` in [`src/db/schema.ts`](src/db/schema.ts)
- [ ] Run database migration to add the new columns

### 2. Excel Import Enhancement

- [ ] Update [`src/app/api/admin/outreach/import/route.ts`](src/app/api/admin/outreach/import/route.ts):
  - Add full name column mappings (fullName, نام و نام خانوادگی, نام کامل, etc.)
  - Update `mapColumns` function to handle fullName extraction
  - Implement logic to construct fullName from firstName + lastName if needed
  - Implement logic to extract firstName and lastName from fullName if provided
- [ ] Update [`src/app/admin/upload-leads/page.tsx`](src/app/admin/upload-leads/page.tsx) to handle fullName in preview
- [ ] Update [`src/components/admin/outreach/lead-preview-table.tsx`](src/components/admin/outreach/lead-preview-table.tsx) to display fullName

### 3. Dynamic Source Handling

- [ ] Update [`src/app/api/admin/outreach/import/route.ts`](src/app/api/admin/outreach/import/route.ts):
  - Modify source handling to accept dynamic source from Excel file
  - Add source column mapping (source, منبع, etc.)
  - Update PUT endpoint to use dynamic source instead of hardcoded "Excel import"

### 4. Customer Form Updates

- [ ] Update [`src/components/admin/outreach/customer-edit-form.tsx`](src/components/admin/outreach/customer-edit-form.tsx):
  - Add fullName field to form schema
  - Add fullName input field with proper validation
  - Update form submission to handle fullName
  - Add logic to sync fullName with firstName/lastName changes

### 5. Manual Source Input

- [ ] Add source input field to [`src/app/admin/upload-leads/page.tsx`](src/app/admin/upload-leads/page.tsx)
- [ ] Update [`src/app/api/admin/outreach/import/route.ts`](src/app/api/admin/outreach/import/route.ts) to accept source parameter
- [ ] Implement validation to require source before upload
- [ ] Use manually provided source for all leads in the upload

### 6. API Endpoint Updates

- [ ] Update [`src/app/api/admin/outreach/leads/route.ts`](src/app/api/admin/outreach/leads/route.ts) to include fullName in responses
- [ ] Update [`src/app/api/admin/outreach/leads/[id]/route.ts`](src/app/api/admin/outreach/leads/[id]/route.ts) to handle fullName in updates
- [ ] Update [`src/app/api/admin/outreach/customers/route.ts`](src/app/api/admin/outreach/customers/route.ts) to include fullName in responses
- [ ] Update [`src/app/api/admin/outreach/customers/[id]/route.ts`](src/app/api/admin/outreach/customers/[id]/route.ts) to handle fullName in updates

### 7. UI Updates

- [ ] Update [`src/app/admin/outreach/leads/page.tsx`](src/app/admin/outreach/leads/page.tsx) to display fullName in table
- [ ] Update [`src/app/admin/outreach/customers/page.tsx`](src/app/admin/outreach/customers/page.tsx) to display fullName in table
- [ ] Consider adding fullName as a searchable field

### 8. Utility Functions

- [ ] Create name parsing utility function to extract firstName/lastName from fullName
- [ ] Add name validation for fullName field
- [ ] Update existing validation functions to handle fullName

## Checklist

### Database Changes ✅

- [x] Add fullName column to leads table
- [x] Add fullName column to customers table
- [x] Run database migration

### Excel Import ✅

- [x] Add full name column header mappings
- [x] Implement fullName extraction from various formats
- [x] Implement firstName/lastName construction from fullName
- [x] Add dynamic source column handling
- [x] Update preview table to show fullName

### Forms and Validation ✅

- [x] Add fullName field to customer edit form
- [x] Add fullName validation
- [x] Implement name synchronization logic

### API Updates ✅

- [x] Update all leads API endpoints for fullName
- [x] Update all customers API endpoints for fullName
- [x] Ensure proper data flow between fullName and firstName/lastName

### UI Updates ✅

- [x] Display fullName in leads table
- [x] Display fullName in customers table
- [x] Make fullName searchable

### Manual Source Input ✅

- [x] Add source input field to upload leads page
- [x] Update API to accept manual source parameter
- [x] Implement source validation and feedback

### Testing

- [ ] Test Excel import with fullName column
- [ ] Test Excel import with firstName/lastName columns
- [ ] Test mixed scenarios (some rows with fullName, others with separate names)
- [ ] Test customer form with fullName field
- [ ] Test API endpoints with fullName data
- [ ] Test search functionality with fullName
- [ ] Test manual source input functionality

### Documentation ✅

- [x] Update any relevant documentation
- [x] Add comments for new fullName handling logic
- [x] Document manual source input feature

## Current Status: ✅ IMPLEMENTATION COMPLETE

All core functionality has been implemented and is ready for testing. The system now supports:

- **Flexible Name Handling**: fullName-only, firstName+lastName-only, or both
- **Manual Source Input**: Custom source for all leads during upload
- **Smart Name Processing**: Automatic extraction and construction of names
- **Nullable Fields**: firstName/lastName can be null to prevent chaos
- **Backward Compatibility**: All existing functionality preserved
- **Persian Support**: Full support for Persian names and UI text

The implementation is ready for testing and handles all the requirements specified in the original task.
