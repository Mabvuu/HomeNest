// index.js
const express = require('express');
const cors = require('cors');
const signupRoutes = require('./signup');
const loginRoutes = require('./login');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', signupRoutes); // handles /auth/signup
app.use('/auth', loginRoutes);  // handles /auth/login

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
