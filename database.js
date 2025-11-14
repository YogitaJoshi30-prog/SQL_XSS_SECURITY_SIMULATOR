const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("data.db", (err) => {
  if (err) console.error("DB error:", err);
  else console.log("Connected to data.db");
});

module.exports = db;
db.serialize(() => {

  // USERS TABLE (LOGIN SYSTEM)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Insert many login users
  db.run(`INSERT OR IGNORE INTO users (username, password) VALUES
    ('admin', 'admin123'),
    ('manager', 'manager123'),
    ('hr', 'hr123'),
    ('developer', 'dev123'),
    ('tester', 'test123'),
    ('finance', 'finance123'),
    ('sales', 'sales123'),
    ('marketing', 'market123'),
    ('support', 'support123'),
    ('data', 'data123'),
    ('researcher', 'r123'),
    ('director', 'dir123'),
    ('ceo', 'ceo123'),
    ('intern', 'intern123'),
    ('trainer', 'train123')
  `);

  // EMPLOYEE TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      salary INTEGER,
      phone TEXT,
      sector TEXT
    )
  `);

  // Insert 10 sample employees
  db.run(`
    INSERT OR IGNORE INTO employees 
      (id, name, age, salary, phone, sector) 
    VALUES
      (1, 'Aarav Sharma', 28, 45000, '9876543210', 'Software Development'),
      (2, 'Riya Verma', 25, 40000, '9988776655', 'Human Resources'),
      (3, 'Sahil Khan', 32, 52000, '9123456780', 'Finance'),
      (4, 'Pooja Singh', 29, 48000, '9090909090', 'Marketing'),
      (5, 'Rohan Gupta', 35, 60000, '9765432109', 'Sales'),
      (6, 'Neha Mehta', 27, 42000, '9812345678', 'Software Testing'),
      (7, 'Vikram Chauhan', 38, 75000, '9333222211', 'Management'),
      (8, 'Divya Patel', 30, 50000, '9445566778', 'Data Analysis'),
      (9, 'Harshit Saxena', 26, 39000, '9001234567', 'Technical Support'),
      (10, 'Simran Kaur', 33, 58000, '9556677880', 'Research & Development')
  `);

  console.log("Database created with 15 login users + 10 employees.");
});

module.exports = db;
