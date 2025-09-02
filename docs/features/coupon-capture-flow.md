# Coupon Capture Flow

## Overview

The coupon capture flow is the primary user interaction for digitizing physical coupons. This process ensures all necessary information is collected for digital storage and future redemption.

## User Flow

1. **Barcode Scanning**

   - User accesses the scan page
   - Camera activates in barcode scanning mode
   - App detects and reads the barcode
   - Barcode is validated and stored temporarily

2. **Expiry Date Input**

   - User is prompted to enter the coupon's expiry date
   - Calendar interface provided for easy date selection
   - Date validation ensures it's not in the past

3. **Description Entry**

   - User enters a short description of the coupon
   - Description helps identify the coupon's value/offer
   - Field is limited to keep descriptions concise

4. **Storage & Confirmation**
   - All information is saved to the database
   - User receives confirmation of successful storage
   - User is redirected to their coupon list

## Data Requirements

### Coupon Record

- `barcode`: string (required) - The scanned barcode value
- `expiryDate`: Date (required) - When the coupon expires
- `description`: string (required) - User-provided description
- `createdAt`: Date - Timestamp of digitization
- `status`: enum ['active', 'used', 'expired'] - Current status

## Validation Rules

1. **Barcode**

   - Must be successfully scanned and readable
   - Must match expected format for Nectar coupons
   - Must not already exist in the system

2. **Expiry Date**

   - Must be a valid future date
   - Cannot be more than 2 years in the future

3. **Description**
   - Required field
   - Minimum 5 characters
   - Maximum 100 characters
   - No special characters except basic punctuation

## Error Handling

1. **Barcode Scanning**

   - Retry option for failed scans
   - Clear error messages for invalid barcodes
   - Option to manually enter barcode

2. **Data Entry**
   - Immediate validation feedback
   - Clear error messages
   - Option to go back and modify entries

## Success Criteria

- Successful barcode scan
- Valid expiry date entered
- Description provided
- Data successfully stored in database
- User notified of success
- Coupon appears in user's list
