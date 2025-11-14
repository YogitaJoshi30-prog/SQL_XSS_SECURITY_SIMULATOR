const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const path = require("path");

const app = express();
const port = 3000;

// Use the correct database
const db = require("./database"); // make sure database.js exports sqlite db
const tokenStore = {}; 
const sessions = {}; // in-memory session store

app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve static files

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { username, password, token } = req.body;

  if (token !== "123456") {
    return res.json({ result: "2FA token required or invalid", success: false });
  }

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) return res.json({ result: "DB error", success: false });
      if (!row) return res.json({ result: "Invalid Credentials", success: false });

      const sessionToken = crypto.randomBytes(16).toString("hex");
      sessions[sessionToken] = username;

      return res.json({
        result: "Login Successful",
        success: true,
        token: sessionToken
      });
    }
  );
});

// ---------------- AUTH MIDDLEWARE ----------------
function authMiddleware(req, res, next) {
  const token = req.headers["x-auth-token"];
  if (!token || !sessions[token]) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.username = sessions[token];
  next();
}

// ---------------- EMPLOYEES ROUTES ----------------
app.get("/dashboard/employees", authMiddleware, (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) return res.json({ error: "DB error" });
    res.json(rows);
  });
});

app.post("/employees/add", authMiddleware, (req, res) => {
  const { name, age, salary, phone, sector } = req.body;
  db.run(
    "INSERT INTO employees (name, age, salary, phone, sector) VALUES (?, ?, ?, ?, ?)",
    [name, age, salary, phone, sector],
    function (err) {
      if (err) return res.json({ error: "DB error" });
      res.json({ result: "Employee added", id: this.lastID });
    }
  );
});

app.put("/employees/update/:id", authMiddleware, (req, res) => {
  const { name, age, salary, phone, sector } = req.body;
  const id = req.params.id;
  db.run(
    "UPDATE employees SET name=?, age=?, salary=?, phone=?, sector=? WHERE id=?",
    [name, age, salary, phone, sector, id],
    function (err) {
      if (err) return res.json({ error: "DB error" });
      res.json({ result: "Employee updated" });
    }
  );
});

app.delete("/employees/delete/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM employees WHERE id=?", [id], (err) => {
    if (err) return res.json({ error: "DB error" });
    res.json({ result: "Employee deleted" });
  });
});

// ---------------- SERVE DASHBOARD ----------------
app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// ---------------- START SERVER ----------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
