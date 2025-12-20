# Convert Database Enums to TypeScript Types

## Description

Convert all database enums defined with pgEnum to pure TypeScript union types. This removes database-level enum constraints and handles validation purely in TypeScript, improving flexibility and avoiding database schema changes for enum modifications.

## Core Logic

- Define TypeScript union types for each enum value
- Remove all pgEnum definitions from schema.ts
- Update table column definitions to use varchar/text with $type<TSType>() for type inference
- Ensure type exports remain compatible
- Add runtime validation where necessary for data integrity

## Relations to Code Files

- [`src/db/schema.ts`](src/db/schema.ts) - Main schema file containing all enum definitions and table structures

## Steps

1. Define TypeScript union types for all enums in schema.ts
2. Remove pgEnum definitions
3. Update table column definitions to use varchar/text with $type<TSType>()
4. Update type exports to use the new TS types
5. Check for any enum-specific queries or validations that need updating
6. Test TypeScript compilation

## Tasklist

- [ ] Define TypeScript union types for all enums
- [ ] Remove pgEnum definitions from schema.ts
- [ ] Update table column definitions
- [ ] Update type exports
- [ ] Verify no breaking changes in queries/components
- [ ] Test compilation and type checking
