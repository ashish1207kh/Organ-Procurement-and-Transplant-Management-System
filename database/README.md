# OPTM Database Documentation & Setup

## Database Overview
The Organ Procurement and Transplant Management (OPTM) database uses a normalized 10-table schema supporting foreign key constraints, indexes, timestamps, and relational integrity.

## Tables
1. `users`: System authentication & role control (`DONOR`, `RECIPIENT`, `ADMIN`)
2. `admin_users`: Administrator credentials and full details
3. `donors`: Donor profiles, contact details, medical history, blood group
4. `donor_organs`: Procured/pledged organs inventory, status, location, viability window
5. `recipients`: Candidate profiles, required organ, hospital center, urgency level
6. `consents`: Audit log of informed consents and withdrawal timestamps
7. `matches`: Calculated match records, 5-factor scores, and status
8. `allocations`: Official organ allocation records and transplant pipeline status
9. `notifications`: In-app alerts and notifications feed
10. `audit_logs`: Operational security audit log of all system actions

## Execution Commands
Import schema and seed data into MySQL 8.0+:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```
