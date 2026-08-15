# Organ Procurement and Transplant Management System (OPTM)

A full-stack, enterprise-style web application for managing organ donation pledges, transplant candidates, recipient waiting list ranking, 5-factor organ compatibility matching, and transplant allocation workflows.

---

## 1. Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS + Custom Medical Theme & Glassmorphism
- **Routing**: React Router DOM (v6)
- **State & Context**: React Context API (`AuthContext`, `NotificationContext`)
- **Forms & Validation**: React Hook Form
- **Icons**: Lucide React
- **Data Visuals**: Recharts (Bar Charts, Pie Charts)
- **HTTP Client**: Axios with JWT Interceptors

### Backend
- **Runtime & Server**: Node.js + Express.js
- **Database Access**: MySQL 8.0+ (`mysql2`) with automatic SQLite in-memory fallback
- **Authentication**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Validation & Security**: Express Validator, CORS, Parameterized SQL queries
- **Logging & Auditing**: Custom Audit Logging & Event Notifications

---

## 2. System Architecture

```text
Landing Page / Role Selection
          │
  ┌───────┼───────┐
  ▼       ▼       ▼
Donor   Recipient Admin
Portal   Portal  Control Center
  │       │       │
  ▼       ▼       ▼
Pledge  Waiting 5-Factor Matching Engine
Organ   List    & Allocation Pipeline
```

---

## 3. Database Schema

- `users` (id, email, password_hash, role, status, created_at)
- `admin_users` (id, user_id, username, email, full_name)
- `donors` (id, user_id, first_name, last_name, phone, blood_group, city, state, consent_status)
- `donor_organs` (id, donor_id, organ_type, blood_group, status, location, viability_hours)
- `recipients` (id, user_id, first_name, last_name, required_organ, urgency_level, status)
- `consents` (id, user_id, user_type, consent_status, consent_text, accepted_at, withdrawn_at)
- `matches` (id, organ_id, recipient_id, match_score, organ_compatibility, blood_group_compatibility, urgency_score, waiting_score, location_score, status)
- `allocations` (id, organ_id, donor_id, recipient_id, match_id, allocated_by, status)
- `notifications` (id, user_id, title, message, type, is_read)
- `audit_logs` (id, user_id, action, entity_type, entity_id, description)

---

## 4. Key Features

1. **Role-Based Access Control (RBAC)**: Donors, Recipients, and Administrators have dedicated, protected portals.
2. **Waiting-List Ranking Algorithm**: `GET /api/recipients/:id/waiting-rank` returns live position (e.g., *"Your place in the waiting list: 1"*).
3. **5-Factor Organ Matching Engine**:
   - Organ Type (30%)
   - ABO Blood Group Compatibility (30%)
   - Recipient Urgency (20%)
   - Waiting Duration (10%)
   - Facility Proximity (10%)
4. **End-to-End Allocation Workflow**: Status transition from Organ Available -> Recipient Matching -> Admin Review -> Allocation -> Transplant -> Completed.
5. **Informed Consent Management**: Tracks donor and recipient consent agreements with the option for donors to withdraw consent prior to organ allocation.
6. **Executive Dashboard**: Recharts visualization of organ distributions, demand metrics, waiting queue volumes, and pipeline status.

---

## 5. Quick Installation & Running Instructions

### Backend Setup
```bash
cd server
npm install
npm start
```
The Express backend server runs on `http://localhost:5000`.

### Frontend Setup
```bash
cd client
npm install
npm run dev
```
The React frontend server runs on `http://localhost:5173`.

### Automated Test Suite
```bash
cd server
npm test
```

---

## 6. Demo Login Credentials

| Role | Email / Username | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@optm.org` | `Admin@123` |
| **Donor** | `john.david@example.com` | `Password@123` |
| **Recipient** | `arun.kumar@example.com` | `Password@123` |

---

## 7. Medical Safety & Scope Disclaimer

This application is an academic/demo management system and does not replace professional medical evaluation, transplant authority policies, or clinical decision-making.
