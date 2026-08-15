-- Organ Procurement and Transplant Management System (OPTM)
-- Database Schema (MySQL 8.0+)

CREATE DATABASE IF NOT EXISTS `optm_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `optm_db`;

-- Drop tables in reverse dependency order for clean re-runs
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `allocations`;
DROP TABLE IF EXISTS `matches`;
DROP TABLE IF EXISTS `consents`;
DROP TABLE IF EXISTS `donor_organs`;
DROP TABLE IF EXISTS `donors`;
DROP TABLE IF EXISTS `recipients`;
DROP TABLE IF EXISTS `admin_users`;
DROP TABLE IF EXISTS `users`;

-- 1. Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('DONOR', 'RECIPIENT', 'ADMIN') NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admin Users Table
CREATE TABLE `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Donors Table
CREATE TABLE `donors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `medical_history` TEXT,
  `current_medications` TEXT,
  `allergies` TEXT,
  `consent_status` ENUM('PENDING', 'ACCEPTED', 'WITHDRAWN') DEFAULT 'ACCEPTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_donors_blood` (`blood_group`),
  INDEX `idx_donors_consent` (`consent_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Donor Organs Table
CREATE TABLE `donor_organs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `donor_id` INT NOT NULL,
  `organ_type` ENUM('Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Intestines', 'Corneas', 'Skin', 'Bone Marrow', 'Bones', 'Tendons') NOT NULL,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `status` ENUM('AVAILABLE', 'RESERVED', 'MATCHED', 'ALLOCATED', 'TRANSPLANTED', 'CANCELLED', 'EXPIRED') DEFAULT 'AVAILABLE',
  `location` VARCHAR(150) NOT NULL,
  `procurement_date` DATETIME,
  `viability_hours` INT DEFAULT 24,
  `viability_status` VARCHAR(255) DEFAULT 'Optimal',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`donor_id`) REFERENCES `donors`(`id`) ON DELETE CASCADE,
  INDEX `idx_organs_type_status` (`organ_type`, `status`),
  INDEX `idx_organs_blood` (`blood_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Recipients Table
CREATE TABLE `recipients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `required_organ` ENUM('Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Intestines', 'Corneas', 'Skin', 'Bone Marrow', 'Bones', 'Tendons') NOT NULL,
  `medical_history` TEXT,
  `current_medications` TEXT,
  `allergies` TEXT,
  `hospital` VARCHAR(200) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `urgency_level` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `status` ENUM('WAITING', 'MATCHED', 'ALLOCATED', 'TRANSPLANTED', 'INACTIVE') DEFAULT 'WAITING',
  `consent_status` ENUM('PENDING', 'ACCEPTED', 'WITHDRAWN') DEFAULT 'ACCEPTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_recipients_organ_urgency` (`required_organ`, `urgency_level`),
  INDEX `idx_recipients_blood` (`blood_group`),
  INDEX `idx_recipients_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Consents Table
CREATE TABLE `consents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `user_type` ENUM('DONOR', 'RECIPIENT') NOT NULL,
  `consent_type` VARCHAR(100) NOT NULL,
  `consent_status` ENUM('ACCEPTED', 'WITHDRAWN') NOT NULL DEFAULT 'ACCEPTED',
  `consent_text` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT '127.0.0.1',
  `accepted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `withdrawn_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_consents_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Matches Table
CREATE TABLE `matches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `organ_id` INT NOT NULL,
  `recipient_id` INT NOT NULL,
  `match_score` DECIMAL(5,2) NOT NULL,
  `organ_compatibility` DECIMAL(5,2) NOT NULL,
  `blood_group_compatibility` DECIMAL(5,2) NOT NULL,
  `urgency_score` DECIMAL(5,2) NOT NULL,
  `waiting_score` DECIMAL(5,2) NOT NULL,
  `location_score` DECIMAL(5,2) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'ALLOCATED') DEFAULT 'PENDING',
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organ_id`) REFERENCES `donor_organs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recipient_id`) REFERENCES `recipients`(`id`) ON DELETE CASCADE,
  INDEX `idx_matches_organ_recipient` (`organ_id`, `recipient_id`),
  INDEX `idx_matches_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Allocations Table
CREATE TABLE `allocations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `organ_id` INT NOT NULL,
  `donor_id` INT NOT NULL,
  `recipient_id` INT NOT NULL,
  `match_id` INT DEFAULT NULL,
  `allocated_by` INT NOT NULL,
  `allocation_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('PENDING', 'IN_TRANSIT', 'ALLOCATED', 'TRANSPLANTED', 'CANCELLED') DEFAULT 'ALLOCATED',
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organ_id`) REFERENCES `donor_organs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`donor_id`) REFERENCES `donors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recipient_id`) REFERENCES `recipients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`allocated_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE SET NULL,
  INDEX `idx_allocations_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Notifications Table
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('INFO', 'SUCCESS', 'WARNING', 'MATCH', 'ALLOCATION') DEFAULT 'INFO',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_notifications_user` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Audit Logs Table
CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT DEFAULT NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_logs_user` (`user_id`),
  INDEX `idx_audit_logs_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
