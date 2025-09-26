const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');  // koneksi PostgreSQL kamu
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3003;
const SECRET_KEY = 'secretkuncimu123'; // ganti dengan secret key yang kuat

app.use(bodyParser.json());
app.use(express.static('public'));

// Register route
app.post('/register', async (req, res) => {
  const { userid, userpwd, usernm } = req.body;

  if (!userid || !userpwd || !usernm) {
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
  }

  try {
    // Cek apakah userid sudah ada
    const exist = await pool.query('SELECT userid FROM users WHERE userid = $1', [userid]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User ID sudah terdaftar' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(userpwd, 10);

    // Insert user baru
    await pool.query(
      `INSERT INTO users (userid, userpwd, usernm, loginyn, usergroup, levelgroup, sysyn) VALUES ($1, $2, $3, 'Y', '0001', '000015', 'Y')`,
      [userid, hashedPwd, usernm]
    );

    res.json({ success: true, message: 'Registrasi berhasil' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { userid, userpwd } = req.body;

  if (!userid || !userpwd) {
    return res.status(400).json({ success: false, message: 'User ID dan password wajib diisi' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User ID atau password salah' });
    }

    const user = result.rows[0];

    // Compare password dengan bcrypt
    const validPassword = await bcrypt.compare(userpwd, user.userpwd);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'User ID atau password salah' });
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        userid: user.userid,
        usernm: user.usernm,
        // data lain yang perlu disimpan di token
      },
      SECRET_KEY,
      { expiresIn: '1h' } // token berlaku 1 jam
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all users (contoh API yang butuh auth)
app.get('/users', (req, res) => {
  pool.query('SELECT userid, usernm, email FROM users', (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json(results.rows);
  });
});

app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});
