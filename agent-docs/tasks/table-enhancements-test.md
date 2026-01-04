# Table Enhancements Test Plan

## Overview

This document outlines the testing plan for the enhanced leads and customers tables with filtering and sorting functionality.

## Test Scenarios

### 1. Leads Table Testing

#### Filter Testing

- [ ] **Source Filter**: Test filtering by different sources (excel, website, referral, other)
- [ ] **Status Filter**: Test filtering by different statuses (lead, contacted, deactivated)
- [ ] **Product Filter**: Test filtering by different products and "همه محصولات"
- [ ] **Combined Filters**: Test multiple filters working together
- [ ] **Search + Filter**: Test search functionality combined with filters

#### Sorting Testing

- [ ] **Created Date Sorting**: Test ascending/descending sort on created date
- [ ] **Updated Date Sorting**: Test ascending/descending sort on updated date
- [ ] **Default Sorting**: Verify default sorting is created date descending
- [ ] **Sort + Filter**: Test sorting works correctly with filters applied

#### UI Testing

- [ ] **Responsive Design**: Verify filters work on mobile and desktop
- [ ] **Visual Feedback**: Check hover effects on sortable headers
- [ ] **Loading States**: Verify loading indicators work during API calls

### 2. Customers Table Testing

#### Filter Testing

- [ ] **Status Filter**: Test filtering by different statuses (new, contacted, target, active, deactivated)
- [ ] **Insurance Type Filter**: Test filtering by different insurance types (life, health, vehicle, property, other)
- [ ] **Preferred Channel Filter**: Test filtering by different channels (whatsapp, sms, email, telegram, bale, eita, instagram)
- [ ] **Combined Filters**: Test multiple filters working together
- [ ] **Search + Filter**: Test search functionality combined with filters

#### Sorting Testing

- [ ] **Created Date Sorting**: Test ascending/descending sort on created date
- [ ] **Updated Date Sorting**: Test ascending/descending sort on updated date
- [ ] **Default Sorting**: Verify default sorting is created date descending
- [ ] **Sort + Filter**: Test sorting works correctly with filters applied

#### UI Testing

- [ ] **Responsive Design**: Verify filters work on mobile and desktop
- [ ] **Visual Feedback**: Check hover effects on sortable headers
- [ ] **Loading States**: Verify loading indicators work during API calls

### 3. API Testing

#### Leads API

- [ ] **Filter Parameters**: Verify API accepts source, status, productId parameters
- [ ] **Sort Parameters**: Verify API accepts sortBy and sortOrder parameters
- [ ] **Combined Parameters**: Test API with multiple filter and sort parameters
- [ ] **Default Behavior**: Verify API defaults to createdAt descending when no sort specified

#### Customers API

- [ ] **Filter Parameters**: Verify API accepts status, insuranceType, preferredChannel parameters
- [ ] **Sort Parameters**: Verify API accepts sortBy and sortOrder parameters
- [ ] **Combined Parameters**: Test API with multiple filter and sort parameters
- [ ] **Default Behavior**: Verify API defaults to createdAt descending when no sort specified

### 4. Database Query Testing

#### Leads Query

- [ ] **Filter Logic**: Verify database query correctly applies filters
- [ ] **Sort Logic**: Verify database query correctly applies sorting
- [ ] **Performance**: Ensure queries perform well with filters and sorting

#### Customers Query

- [ ] **Filter Logic**: Verify database query correctly applies filters
- [ ] **Sort Logic**: Verify database query correctly applies sorting
- [ ] **Performance**: Ensure queries perform well with filters and sorting

## Expected Results

### Leads Table

- Filters should work independently and in combination
- Sorting should toggle between ascending and descending
- Default sorting should be by created date descending (most recent first)
- UI should be responsive and provide visual feedback
- API calls should include correct parameters

### Customers Table

- Filters should work independently and in combination
- Sorting should toggle between ascending and descending
- Default sorting should be by created date descending (most recent first)
- UI should be responsive and provide visual feedback
- API calls should include correct parameters

## Test Data Requirements

### Leads

- Multiple leads with different sources (excel, website, referral, other)
- Leads with different statuses (lead, contacted, deactivated)
- Leads associated with different products
- Leads with various creation dates

### Customers

- Multiple customers with different statuses
- Customers with different insurance types
- Customers with different preferred channels
- Customers with various creation dates

## Notes

- All tests should be performed in a development environment
- Test with both existing data and newly created test data
- Verify that pagination works correctly with filters and sorting
- Check that the "همه" (All) options work correctly for all filters
