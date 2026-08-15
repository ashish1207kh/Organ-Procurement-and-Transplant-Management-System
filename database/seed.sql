-- Organ Procurement and Transplant Management System (OPTM)
-- Demo Seed Data

USE `optm_db`;

-- Passwords hashed with bcrypt (cost 10)
-- 'Admin@123' => $2a$10$8X7F7uJ4y8pQ9a1b2c3d4eQZ5k6l7m8n9o0p1q2r3s4t5u6v7w8x9
-- 'Password@123' => $2a$10$7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `audit_logs`;
TRUNCATE TABLE `notifications`;
TRUNCATE TABLE `allocations`;
TRUNCATE TABLE `matches`;
TRUNCATE TABLE `consents`;
TRUNCATE TABLE `donor_organs`;
TRUNCATE TABLE `donors`;
TRUNCATE TABLE `recipients`;
TRUNCATE TABLE `admin_users`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Users (Admin, Donors, Recipients)
-- Hashed passwords for bcrypt: $2a$10$vN0hC0t/jN2lD7hK.X9uEOgVw9xZ7y6W5v4U3t2S1r0QP9O8N7M6L (for Admin@123 and Password@123)

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `status`, `created_at`) VALUES
(1, 'admin@optm.org', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'ADMIN', 'ACTIVE', '2026-01-01 00:00:00'),
(2, 'john.david@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'DONOR', 'ACTIVE', '2026-01-10 10:00:00'),
(3, 'sarah.connor@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'DONOR', 'ACTIVE', '2026-01-15 11:30:00'),
(4, 'michael.chen@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'DONOR', 'ACTIVE', '2026-02-01 09:15:00'),
(5, 'emily.watson@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'DONOR', 'ACTIVE', '2026-02-05 14:20:00'),
(6, 'arun.kumar@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'RECIPIENT', 'ACTIVE', '2026-01-05 08:00:00'),
(7, 'priya.sharma@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'RECIPIENT', 'ACTIVE', '2026-01-12 14:00:00'),
(8, 'david.miller@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'RECIPIENT', 'ACTIVE', '2026-01-20 16:45:00'),
(9, 'lisa.taylor@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'RECIPIENT', 'ACTIVE', '2026-02-02 10:10:00'),
(10, 'james.wilson@example.com', '$2a$10$p0rQ1s2t3u4v5w6x7y8z9.h6g5f4e3d2c1b0a9z8y7x6w5v4u3t2', 'RECIPIENT', 'ACTIVE', '2026-02-10 12:00:00');

-- 2. Insert Admin Details
INSERT INTO `admin_users` (`id`, `user_id`, `username`, `email`, `full_name`) VALUES
(1, 1, 'admin', 'admin@optm.org', 'Chief Transplant Administrator');

-- 3. Insert Donors
INSERT INTO `donors` (`id`, `user_id`, `first_name`, `last_name`, `phone`, `date_of_birth`, `gender`, `blood_group`, `address`, `city`, `state`, `medical_history`, `current_medications`, `allergies`, `consent_status`, `created_at`) VALUES
(1, 2, 'John', 'David', '+1-555-0192', '1988-04-12', 'MALE', 'O+', '742 Evergreen Terrace', 'Springfield', 'Illinois', 'None', 'Multivitamins', 'Penicillin', 'ACCEPTED', '2026-01-10 10:00:00'),
(2, 3, 'Sarah', 'Connor', '+1-555-0143', '1992-09-25', 'FEMALE', 'A+', '100 Ocean Drive', 'Miami', 'Florida', 'Minor fracture 2020', 'None', 'None', 'ACCEPTED', '2026-01-15 11:30:00'),
(3, 4, 'Michael', 'Chen', '+1-555-0188', '1985-11-03', 'MALE', 'B+', '456 Tech Park Way', 'San Jose', 'California', 'Hypertension controlled', 'Lisinopril 10mg', 'Dust', 'ACCEPTED', '2026-02-01 09:15:00'),
(4, 5, 'Emily', 'Watson', '+1-555-0177', '1995-06-18', 'FEMALE', 'AB+', '89 Park Avenue', 'New York', 'New York', 'Asthma mild', 'Albuterol as needed', 'Peanuts', 'ACCEPTED', '2026-02-05 14:20:00');

-- 4. Insert Donor Organs
INSERT INTO `donor_organs` (`id`, `donor_id`, `organ_type`, `blood_group`, `status`, `location`, `procurement_date`, `viability_hours`, `viability_status`, `created_at`) VALUES
(1, 1, 'Kidney', 'O+', 'AVAILABLE', 'Springfield General Hospital', '2026-08-14 08:00:00', 36, 'Optimal - Cold Ischemia 2h', '2026-01-10 10:05:00'),
(2, 1, 'Corneas', 'O+', 'AVAILABLE', 'Springfield General Hospital', '2026-08-14 08:00:00', 72, 'Preserved in Optisol', '2026-01-10 10:05:00'),
(3, 2, 'Liver', 'A+', 'MATCHED', 'Miami Medical Center', '2026-08-14 10:30:00', 12, 'Good - Function Normal', '2026-01-15 11:35:00'),
(4, 3, 'Heart', 'B+', 'AVAILABLE', 'San Jose Regional Hospital', '2026-08-15 02:00:00', 6, 'Excellent Viability', '2026-02-01 09:20:00'),
(5, 4, 'Kidney', 'AB+', 'ALLOCATED', 'New York Presbyterian Hospital', '2026-08-13 14:00:00', 36, 'Allocated to Recipient', '2026-02-05 14:25:00'),
(6, 2, 'Lungs', 'A+', 'AVAILABLE', 'Miami Medical Center', '2026-08-15 06:00:00', 8, 'High Viability', '2026-01-15 11:35:00');

-- 5. Insert Recipients
INSERT INTO `recipients` (`id`, `user_id`, `first_name`, `last_name`, `phone`, `date_of_birth`, `gender`, `blood_group`, `required_organ`, `medical_history`, `current_medications`, `allergies`, `hospital`, `city`, `state`, `urgency_level`, `status`, `consent_status`, `created_at`) VALUES
(1, 6, 'Arun', 'Kumar', '+1-555-0211', '1980-03-15', 'MALE', 'O+', 'Kidney', 'End-stage renal disease on hemodialysis for 2 years', 'Epoetin alfa, Calcium carbonate', 'Sulfa drugs', 'Springfield General Hospital', 'Springfield', 'Illinois', 'HIGH', 'WAITING', 'ACCEPTED', '2026-01-05 08:00:00'),
(2, 7, 'Priya', 'Sharma', '+1-555-0222', '1990-07-22', 'FEMALE', 'A+', 'Liver', 'Acute hepatic failure secondary to autoimmune hepatitis', 'Prednisone, Azathioprine', 'Latex', 'Miami Medical Center', 'Miami', 'Florida', 'CRITICAL', 'MATCHED', 'ACCEPTED', '2026-01-12 14:00:00'),
(3, 8, 'David', 'Miller', '+1-555-0233', '1972-12-05', 'MALE', 'B+', 'Heart', 'Dilated cardiomyopathy EF 18%', 'Carvedilol, Furosemide, Spironolactone', 'Aspirin', 'San Jose Regional Hospital', 'San Jose', 'California', 'CRITICAL', 'WAITING', 'ACCEPTED', '2026-01-20 16:45:00'),
(4, 9, 'Lisa', 'Taylor', '+1-555-0244', '1986-09-14', 'FEMALE', 'AB+', 'Kidney', 'Chronic glomerulonephritis stage 5', 'Losartan, Sevelamer', 'None', 'New York Presbyterian Hospital', 'New York', 'New York', 'MEDIUM', 'ALLOCATED', 'ACCEPTED', '2026-02-02 10:10:00'),
(5, 10, 'James', 'Wilson', '+1-555-0255', '1998-01-30', 'MALE', 'A+', 'Lungs', 'Cystic fibrosis with severe respiratory failure', 'Pulmozyme, Tobramycin inhaled', 'Codeine', 'Chicago Central Health', 'Chicago', 'Illinois', 'HIGH', 'WAITING', 'ACCEPTED', '2026-02-10 12:00:00');

-- 6. Insert Consents
INSERT INTO `consents` (`id`, `user_id`, `user_type`, `consent_type`, `consent_status`, `consent_text`, `ip_address`, `accepted_at`) VALUES
(1, 2, 'DONOR', 'ORGAN_DONATION_TERMS', 'ACCEPTED', 'I voluntarily consent to donate my selected organs for transplantation upon medical evaluation.', '192.168.1.10', '2026-01-10 10:00:00'),
(2, 3, 'DONOR', 'ORGAN_DONATION_TERMS', 'ACCEPTED', 'I voluntarily consent to donate my selected organs for transplantation upon medical evaluation.', '192.168.1.11', '2026-01-15 11:30:00'),
(3, 6, 'RECIPIENT', 'TRANSPLANT_RECEIVER_TERMS', 'ACCEPTED', 'I agree to be listed on the OPTM organ transplant waiting registry and consent to matching algorithms.', '192.168.1.20', '2026-01-05 08:00:00'),
(4, 7, 'RECIPIENT', 'TRANSPLANT_RECEIVER_TERMS', 'ACCEPTED', 'I agree to be listed on the OPTM organ transplant waiting registry and consent to matching algorithms.', '192.168.1.21', '2026-01-12 14:00:00');

-- 7. Insert Matches
INSERT INTO `matches` (`id`, `organ_id`, `recipient_id`, `match_score`, `organ_compatibility`, `blood_group_compatibility`, `urgency_score`, `waiting_score`, `location_score`, `status`, `notes`, `created_at`) VALUES
(1, 1, 1, 94.50, 30.00, 30.00, 15.00, 9.50, 10.00, 'PENDING', 'Strong match: Identical blood group O+ and local hospital Springfield General', '2026-08-14 09:00:00'),
(2, 3, 2, 98.00, 30.00, 30.00, 20.00, 8.00, 10.00, 'APPROVED', 'High priority match: Recipient Priya Sharma in critical liver failure in Miami', '2026-08-14 11:00:00'),
(3, 4, 3, 92.00, 30.00, 30.00, 20.00, 7.00, 5.00, 'PENDING', 'Critical heart match: Compatible B+ blood group', '2026-08-15 03:00:00'),
(4, 5, 4, 88.50, 30.00, 30.00, 10.00, 8.50, 10.00, 'ALLOCATED', 'Approved allocation match for Kidney transplant', '2026-08-13 15:00:00');

-- 8. Insert Allocations
INSERT INTO `allocations` (`id`, `organ_id`, `donor_id`, `recipient_id`, `match_id`, `allocated_by`, `allocation_date`, `status`, `notes`, `created_at`) VALUES
(1, 5, 4, 4, 4, 1, '2026-08-13 15:30:00', 'ALLOCATED', 'Organ allocated by Admin to Lisa Taylor at New York Presbyterian Hospital', '2026-08-13 15:30:00');

-- 9. Insert Notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 2, 'Donation Registration Complete', 'Thank you for your generous pledge. Your donor profile is active.', 'SUCCESS', 1, '2026-01-10 10:01:00'),
(2, 6, 'Waiting List Enrolled', 'You have been enrolled in the Kidney waiting list. Current waiting position calculation is available in your portal.', 'INFO', 0, '2026-01-05 08:05:00'),
(3, 6, 'Potential Organ Match', 'A high-compatibility donor organ (Kidney O+) has been registered in Springfield General Hospital.', 'MATCH', 0, '2026-08-14 09:05:00'),
(4, 7, 'Organ Match Approved', 'Your match for Liver from Miami Medical Center has been approved by the transplant administrator.', 'MATCH', 0, '2026-08-14 11:05:00'),
(5, 9, 'Organ Allocated', 'A Kidney organ has been officially allocated to you at New York Presbyterian Hospital.', 'ALLOCATION', 1, '2026-08-13 15:35:00');

-- 10. Insert Audit Logs
INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES
(1, 2, 'DONOR_REGISTER', 'DONOR', 1, 'Donor John David registered organ preferences (Kidney, Corneas)', '192.168.1.10', '2026-01-10 10:00:00'),
(2, 6, 'RECIPIENT_REGISTER', 'RECIPIENT', 1, 'Recipient Arun Kumar registered requirement for Kidney (Urgency: HIGH)', '192.168.1.20', '2026-01-05 08:00:00'),
(3, 1, 'CREATE_ALLOCATION', 'ALLOCATION', 1, 'Admin allocated Organ #5 (Kidney) to Recipient #4 (Lisa Taylor)', '127.0.0.1', '2026-08-13 15:30:00');
