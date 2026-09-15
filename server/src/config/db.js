const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

let pool = null;
let dbMode = 'UNKNOWN'; // 'MYSQL' or 'SQLITE'
let sqliteDb = null;

// Helper to convert parameterized query params for SQLite if needed (?) -> (?)
const formatQueryForSqlite = (sql) => {
  let sqliteSql = sql
    .replace(/ON UPDATE CURRENT_TIMESTAMP/gi, '')
    .replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;/gi, ';')
    .replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;/gi, ';')
    .replace(/TINYINT\(1\)/gi, 'INTEGER')
    .replace(/DECIMAL\(5,2\)/gi, 'REAL')
    .replace(/NOW\(\)/gi, "DATETIME('now')")
    .replace(/CURDATE\(\)/gi, "DATE('now')")
    .replace(/GROUP_CONCAT\((.*?)\s+SEPARATOR\s+('.*?'|".*?")\)/gi, 'GROUP_CONCAT($1, $2)')
    .replace(/TIMESTAMPDIFF\(YEAR,\s*([^,]+?),\s*(?:CURDATE\(\)|NOW\(\)|DATE\('now'\)|DATETIME\('now'\))\)/gi, "CAST((strftime('%Y', 'now') - strftime('%Y', $1)) AS INTEGER)");
  
  return sqliteSql;
};

// Promise wrapper for SQLite run
const sqliteRun = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

// Promise wrapper for SQLite exec
const sqliteExec = (db, sql) => new Promise((resolve, reject) => {
  db.exec(sql, (err) => {
    if (err) reject(err);
    else resolve();
  });
});

// Seed SQLite in memory with seed dataset
const seedSqliteDatabase = async (db) => {
  const bcrypt = require('bcryptjs');
  const defaultHash = await bcrypt.hash('Password@123', 10);
  const adminHash = await bcrypt.hash('Admin@123', 10);

  const createTablesSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS donors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT NOT NULL,
      blood_group TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      medical_history TEXT,
      current_medications TEXT,
      allergies TEXT,
      consent_status TEXT DEFAULT 'ACCEPTED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS donor_organs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_id INTEGER NOT NULL,
      organ_type TEXT NOT NULL,
      blood_group TEXT NOT NULL,
      status TEXT DEFAULT 'AVAILABLE',
      location TEXT NOT NULL,
      procurement_date DATETIME,
      viability_hours INTEGER DEFAULT 24,
      viability_status TEXT DEFAULT 'Optimal',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recipients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT NOT NULL,
      blood_group TEXT NOT NULL,
      required_organ TEXT NOT NULL,
      medical_history TEXT,
      current_medications TEXT,
      allergies TEXT,
      hospital TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      urgency_level TEXT DEFAULT 'MEDIUM',
      status TEXT DEFAULT 'WAITING',
      consent_status TEXT DEFAULT 'ACCEPTED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS consents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_type TEXT NOT NULL,
      consent_type TEXT NOT NULL,
      consent_status TEXT DEFAULT 'ACCEPTED',
      consent_text TEXT NOT NULL,
      ip_address TEXT DEFAULT '127.0.0.1',
      accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      withdrawn_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organ_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      match_score REAL NOT NULL,
      organ_compatibility REAL NOT NULL,
      blood_group_compatibility REAL NOT NULL,
      urgency_score REAL NOT NULL,
      waiting_score REAL NOT NULL,
      location_score REAL NOT NULL,
      status TEXT DEFAULT 'PENDING',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS allocations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organ_id INTEGER NOT NULL,
      donor_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      match_id INTEGER,
      allocated_by INTEGER NOT NULL,
      allocation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'ALLOCATED',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'INFO',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      description TEXT NOT NULL,
      ip_address TEXT DEFAULT '127.0.0.1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sqliteExec(db, createTablesSql);

  // Seed Users
  await sqliteRun(db, `INSERT OR IGNORE INTO users (id, email, password_hash, role, status) VALUES 
    (1, 'admin@optm.org', ?, 'ADMIN', 'ACTIVE'),
    (2, 'john.david@example.com', ?, 'DONOR', 'ACTIVE'),
    (3, 'sarah.connor@example.com', ?, 'DONOR', 'ACTIVE'),
    (4, 'michael.chen@example.com', ?, 'DONOR', 'ACTIVE'),
    (5, 'emily.watson@example.com', ?, 'DONOR', 'ACTIVE'),
    (6, 'arun.kumar@example.com', ?, 'RECIPIENT', 'ACTIVE'),
    (7, 'priya.sharma@example.com', ?, 'RECIPIENT', 'ACTIVE'),
    (8, 'david.miller@example.com', ?, 'RECIPIENT', 'ACTIVE'),
    (9, 'lisa.taylor@example.com', ?, 'RECIPIENT', 'ACTIVE'),
    (10, 'james.wilson@example.com', ?, 'RECIPIENT', 'ACTIVE')`,
    [adminHash, defaultHash, defaultHash, defaultHash, defaultHash, defaultHash, defaultHash, defaultHash, defaultHash, defaultHash]
  );

  // Seed Admin Details
  await sqliteRun(db, `INSERT OR IGNORE INTO admin_users (id, user_id, username, email, full_name) VALUES 
    (1, 1, 'admin', 'admin@optm.org', 'Chief Transplant Administrator')`);

  // Seed Donors
  await sqliteRun(db, `INSERT OR IGNORE INTO donors (id, user_id, first_name, last_name, phone, date_of_birth, gender, blood_group, address, city, state, medical_history, current_medications, allergies, consent_status) VALUES
    (1, 2, 'John', 'David', '+1-555-0192', '1988-04-12', 'MALE', 'O+', '742 Evergreen Terrace', 'Springfield', 'Illinois', 'None', 'Multivitamins', 'Penicillin', 'ACCEPTED'),
    (2, 3, 'Sarah', 'Connor', '+1-555-0143', '1992-09-25', 'FEMALE', 'A+', '100 Ocean Drive', 'Miami', 'Florida', 'Minor fracture 2020', 'None', 'None', 'ACCEPTED'),
    (3, 4, 'Michael', 'Chen', '+1-555-0188', '1985-11-03', 'MALE', 'B+', '456 Tech Park Way', 'San Jose', 'California', 'Hypertension controlled', 'Lisinopril 10mg', 'Dust', 'ACCEPTED'),
    (4, 5, 'Emily', 'Watson', '+1-555-0177', '1995-06-18', 'FEMALE', 'AB+', '89 Park Avenue', 'New York', 'New York', 'Asthma mild', 'Albuterol as needed', 'Peanuts', 'ACCEPTED')`);

  // Seed Donor Organs
  await sqliteRun(db, `INSERT OR IGNORE INTO donor_organs (id, donor_id, organ_type, blood_group, status, location, procurement_date, viability_hours, viability_status) VALUES
    (1, 1, 'Kidney', 'O+', 'AVAILABLE', 'Springfield General Hospital', '2026-08-14 08:00:00', 36, 'Optimal - Cold Ischemia 2h'),
    (2, 1, 'Corneas', 'O+', 'AVAILABLE', 'Springfield General Hospital', '2026-08-14 08:00:00', 72, 'Preserved in Optisol'),
    (3, 2, 'Liver', 'A+', 'MATCHED', 'Miami Medical Center', '2026-08-14 10:30:00', 12, 'Good - Function Normal'),
    (4, 3, 'Heart', 'B+', 'AVAILABLE', 'San Jose Regional Hospital', '2026-08-15 02:00:00', 6, 'Excellent Viability'),
    (5, 4, 'Kidney', 'AB+', 'ALLOCATED', 'New York Presbyterian Hospital', '2026-08-13 14:00:00', 36, 'Allocated to Recipient'),
    (6, 2, 'Lungs', 'A+', 'AVAILABLE', 'Miami Medical Center', '2026-08-15 06:00:00', 8, 'High Viability')`);

  // Seed Recipients
  await sqliteRun(db, `INSERT OR IGNORE INTO recipients (id, user_id, first_name, last_name, phone, date_of_birth, gender, blood_group, required_organ, medical_history, current_medications, allergies, hospital, city, state, urgency_level, status, consent_status) VALUES
    (1, 6, 'Arun', 'Kumar', '+1-555-0211', '1980-03-15', 'MALE', 'O+', 'Kidney', 'End-stage renal disease on hemodialysis for 2 years', 'Epoetin alfa, Calcium carbonate', 'Sulfa drugs', 'Springfield General Hospital', 'Springfield', 'Illinois', 'HIGH', 'WAITING', 'ACCEPTED'),
    (2, 7, 'Priya', 'Sharma', '+1-555-0222', '1990-07-22', 'FEMALE', 'A+', 'Liver', 'Acute hepatic failure secondary to autoimmune hepatitis', 'Prednisone, Azathioprine', 'Latex', 'Miami Medical Center', 'Miami', 'Florida', 'CRITICAL', 'MATCHED', 'ACCEPTED'),
    (3, 8, 'David', 'Miller', '+1-555-0233', '1972-12-05', 'MALE', 'B+', 'Heart', 'Dilated cardiomyopathy EF 18%', 'Carvedilol, Furosemide, Spironolactone', 'Aspirin', 'San Jose Regional Hospital', 'San Jose', 'California', 'CRITICAL', 'WAITING', 'ACCEPTED'),
    (4, 9, 'Lisa', 'Taylor', '+1-555-0244', '1986-09-14', 'FEMALE', 'AB+', 'Kidney', 'Chronic glomerulonephritis stage 5', 'Losartan, Sevelamer', 'None', 'New York Presbyterian Hospital', 'New York', 'New York', 'MEDIUM', 'ALLOCATED', 'ACCEPTED'),
    (5, 10, 'James', 'Wilson', '+1-555-0255', '1998-01-30', 'MALE', 'A+', 'Lungs', 'Cystic fibrosis with severe respiratory failure', 'Pulmozyme, Tobramycin inhaled', 'Codeine', 'Chicago Central Health', 'Chicago', 'Illinois', 'HIGH', 'WAITING', 'ACCEPTED')`);

  // Seed Consents
  await sqliteRun(db, `INSERT OR IGNORE INTO consents (id, user_id, user_type, consent_type, consent_status, consent_text, ip_address) VALUES
    (1, 2, 'DONOR', 'ORGAN_DONATION_TERMS', 'ACCEPTED', 'I voluntarily consent to donate my selected organs for transplantation upon medical evaluation.', '192.168.1.10'),
    (2, 3, 'DONOR', 'ORGAN_DONATION_TERMS', 'ACCEPTED', 'I voluntarily consent to donate my selected organs for transplantation upon medical evaluation.', '192.168.1.11'),
    (3, 6, 'RECIPIENT', 'TRANSPLANT_RECEIVER_TERMS', 'ACCEPTED', 'I agree to be listed on the OPTM organ transplant waiting registry and consent to matching algorithms.', '192.168.1.20'),
    (4, 7, 'RECIPIENT', 'TRANSPLANT_RECEIVER_TERMS', 'ACCEPTED', 'I agree to be listed on the OPTM organ transplant waiting registry and consent to matching algorithms.', '192.168.1.21')`);

  // Seed Matches
  await sqliteRun(db, `INSERT OR IGNORE INTO matches (id, organ_id, recipient_id, match_score, organ_compatibility, blood_group_compatibility, urgency_score, waiting_score, location_score, status, notes) VALUES
    (1, 1, 1, 94.50, 30.00, 30.00, 15.00, 9.50, 10.00, 'PENDING', 'Strong match: Identical blood group O+ and local hospital Springfield General'),
    (2, 3, 2, 98.00, 30.00, 30.00, 20.00, 8.00, 10.00, 'APPROVED', 'High priority match: Recipient Priya Sharma in critical liver failure in Miami'),
    (3, 4, 3, 92.00, 30.00, 30.00, 20.00, 7.00, 5.00, 'PENDING', 'Critical heart match: Compatible B+ blood group'),
    (4, 5, 4, 88.50, 30.00, 30.00, 10.00, 8.50, 10.00, 'ALLOCATED', 'Approved allocation match for Kidney transplant')`);

  // Seed Allocations
  await sqliteRun(db, `INSERT OR IGNORE INTO allocations (id, organ_id, donor_id, recipient_id, match_id, allocated_by, status, notes) VALUES
    (1, 5, 4, 4, 4, 1, 'ALLOCATED', 'Organ allocated by Admin to Lisa Taylor at New York Presbyterian Hospital')`);

  // Seed Notifications
  await sqliteRun(db, `INSERT OR IGNORE INTO notifications (id, user_id, title, message, type, is_read) VALUES
    (1, 2, 'Donation Registration Complete', 'Thank you for your generous pledge. Your donor profile is active.', 'SUCCESS', 1),
    (2, 6, 'Waiting List Enrolled', 'You have been enrolled in the Kidney waiting list. Current waiting position calculation is available in your portal.', 'INFO', 0),
    (3, 6, 'Potential Organ Match', 'A high-compatibility donor organ (Kidney O+) has been registered in Springfield General Hospital.', 'MATCH', 0),
    (4, 7, 'Organ Match Approved', 'Your match for Liver from Miami Medical Center has been approved by the transplant administrator.', 'MATCH', 0),
    (5, 9, 'Organ Allocated', 'A Kidney organ has been officially allocated to you at New York Presbyterian Hospital.', 'ALLOCATION', 1)`);

  // Seed Audit Logs
  await sqliteRun(db, `INSERT OR IGNORE INTO audit_logs (id, user_id, action, entity_type, entity_id, description) VALUES
    (1, 2, 'DONOR_REGISTER', 'DONOR', 1, 'Donor John David registered organ preferences (Kidney, Corneas)'),
    (2, 6, 'RECIPIENT_REGISTER', 'RECIPIENT', 1, 'Recipient Arun Kumar registered requirement for Kidney (Urgency: HIGH)'),
    (3, 1, 'CREATE_ALLOCATION', 'ALLOCATION', 1, 'Admin allocated Organ #5 (Kidney) to Recipient #4 (Lisa Taylor)')`);
};

// Initialize DB connection with MySQL or fallback to SQLite
const initDb = async () => {
  if (pool || sqliteDb) return;

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'optm_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  try {
    const testPool = mysql.createPool(dbConfig);
    const connection = await testPool.getConnection();
    connection.release();
    pool = testPool;
    dbMode = 'MYSQL';
    console.log(`[DB] Successfully connected to MySQL database: ${dbConfig.database}`);
  } catch (err) {
    console.warn(`[DB] MySQL connection attempt failed (${err.message}). Initializing embedded SQLite database fallback...`);
    dbMode = 'SQLITE';
    sqliteDb = new sqlite3.Database(':memory:');
    await seedSqliteDatabase(sqliteDb);
    console.log(`[DB] Successfully initialized SQLite embedded database with demo dataset.`);
  }
};

// Execute query (Unified API for both MySQL and SQLite)
const query = async (sql, params = []) => {
  await initDb();

  if (dbMode === 'MYSQL') {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } else {
    return new Promise((resolve, reject) => {
      const cleanSql = formatQueryForSqlite(sql);
      const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN)/i.test(cleanSql);

      if (isSelect) {
        sqliteDb.all(cleanSql, params, (err, rows) => {
          if (err) {
            console.error(`[SQLite Error]`, err.message, `SQL: ${cleanSql}`);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      } else {
        sqliteDb.run(cleanSql, params, function (err) {
          if (err) {
            console.error(`[SQLite Error]`, err.message, `SQL: ${cleanSql}`);
            reject(err);
          } else {
            resolve({
              insertId: this.lastID,
              affectedRows: this.changes
            });
          }
        });
      }
    });
  }
};

// Transaction wrapper helper
const queryTransaction = async (callback) => {
  await initDb();
  if (dbMode === 'MYSQL') {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback({
        query: async (sql, params = []) => {
          const [rows] = await connection.execute(sql, params);
          return rows;
        }
      });
      await connection.commit();
      return result;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } else {
    return await callback({ query });
  }
};

module.exports = {
  query,
  queryTransaction,
  initDb,
  getDbMode: () => dbMode
};
