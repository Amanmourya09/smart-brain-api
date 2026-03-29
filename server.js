const express = require('express');
const bodyParser = require('body-parser'); // (optional, not needed but fine)
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// 🔥 FIXED DB CONNECTION (IMPORTANT CHANGE)
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL, // 👈 CHANGE: string → object
    ssl: {
      rejectUnauthorized: false                // 👈 CHANGE: SSL properly enable kiya
    }
  }
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working');
});

app.post('/signin', signin.handleSignin(db, bcrypt));

// 🔥 DEBUG (already correct)
app.post('/register', (req, res) => {
  console.log("REGISTER HIT 👉", req.body); // 👈 request aa rahi hai ya nahi check
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});