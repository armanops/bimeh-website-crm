# Table Enhancements: Filters and Sorting

## Description

Enhance the leads and customers tables with comprehensive filtering capabilities and date sorting functionality, similar to the message templates panel. This will improve data management and user experience for filtering leads and customers by various characteristics.

## Core Logic

- Add filter dropdowns for key characteristics (source, status, product for leads; status, insurance type, preferred channel for customers)
- Implement sortable table headers for created and updated dates
- Set default sorting to created date descending (most recent first)
- Maintain existing functionality while adding new filtering capabilities
- Use consistent UI patterns matching the existing message templates panel

## Relations to Code Files

- `src/app/admin/outreach/leads/page.tsx` - Main leads table page
- `src/app/admin/outreach/customers/page.tsx` - Main customers table page
- `src/components/admin/templates/templates-table.tsx` - Reference for filter implementation
- `src/app/api/admin/outreach/leads/route.ts` - May need API enhancements for filtering
- `src/app/api/admin/outreach/customers/route.ts` - May need API enhancements for filtering

## Steps

### 1. Analyze Current Implementation

- Review existing leads and customers table structure
- Identify filterable fields from database schema
- Check API endpoints for existing filtering capabilities

### 2. Enhance Leads Table

- Add filter dropdowns for source, status, and product
- Implement sortable headers for created and updated dates
- Add default sorting by created date descending
- Update API calls to include filter parameters
- Maintain existing pagination and search functionality

### 3. Enhance Customers Table

- Add filter dropdowns for status, insurance type, and preferred channel
- Implement sortable headers for created and updated dates
- Add default sorting by created date descending
- Update API calls to include filter parameters
- Maintain existing pagination and search functionality

### 4. API Enhancements (if needed)

- Update leads API to support filtering by source, status, product
- Update customers API to support filtering by status, insurance type, preferred channel
- Add sorting parameters to API endpoints

### 5. UI Consistency

- Match filter dropdown styles with message templates panel
- Use consistent badge and label formatting
- Ensure proper RTL layout support
- Maintain responsive design

## Tasklist

- [ ] Analyze current table implementation and API capabilities
- [ ] Add filter dropdowns to leads table (source, status, product)
- [ ] Add sortable date headers to leads table
- [ ] Set default sorting for leads table (created date desc)
- [ ] Add filter dropdowns to customers table (status, insurance type, preferred channel)
- [ ] Add sortable date headers to customers table
- [ ] Set default sorting for customers table (created date desc)
- [ ] Update API endpoints to support new filtering parameters
- [ ] Test filtering functionality for both tables
- [ ] Verify sorting works correctly for date fields
- [ ] Ensure responsive design is maintained
- [ ] Test with various filter combinations
