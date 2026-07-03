const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin/family login using credentials set in environment variables
// @access  Public
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.json({
    token,
    username,
  });
});

module.exports = router;
