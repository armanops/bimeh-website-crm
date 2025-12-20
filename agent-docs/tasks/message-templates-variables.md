## Message Templates with Variable Replacement

### Description

Enhance message templates to support dynamic variables like {{firstName}}, {{lastName}} replaced with actual data from leads or customers. Handle missing data gracefully.

### Core Logic

- Create utility function to replace {{fieldName}} with values from record object.
- Support fields: firstName, lastName, phone, nationalId, birthCertificateNumber, birthCertificateIssuancePlace, placeOfBirth, dateOfBirth, telegramId, whatsappId, eitaId, baleId, email, gender, maritalStatus, numberOfChildren, militaryServiceStatus, occupation, landlinePhone, emergencyPhone, emergencyPhoneRelation, residentialAddress, workAddress, residentialPostalCode.
- If field missing, leave placeholder or replace with empty.
- Use in template selection and message generation.

### Relations to Code Files

- Schema: [`src/db/schema.ts`](src/db/schema.ts)
- Utility: New in `/lib/template-utils.ts`
- Templates table: Existing messageTemplatesTable

### Steps

1. Create template replacement utility.
2. Update template usage in marketing panel.
3. Test with sample data.

### Tasklist

- [ ] Create template replacement utility function
- [ ] Define supported fields mapping
- [ ] Handle missing fields
- [ ] Integrate in message generation
- [ ] Test variable replacement
