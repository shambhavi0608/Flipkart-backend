const mongoose = require("mongoose"); // MongoDB se connect hone aur data handle karne ke liye
const express = require("express"); // Web server banane ke liye
const jwt = require("jsonwebtoken"); // Token generate aur verify karne ke liye (JWT = JSON Web Token)
const bcryptjs = require("bcryptjs"); // Password ko secure tarike se encrypt (hash) karne ke liye

const router = express.Router(); // Routes banane ke liye express ka ek feature le rahe hain

// User ke data ka structure define kar rahe hain (email + password)
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email required hai, aur unique hona chahiye
  password: { type: String, required: true } // Password bhi required hai
}));

// ✅ Signup Route
router.post("/auth/signup", async (req, res) => { // Jab koi user signup karega
  const { email, password } = req.body; // Request se email aur password nikaal rahe hain

  const existingUser = await User.findOne({ email }); // Check kar rahe hain ki user already hai ya nahi
  if (existingUser) { // Agar mil gaya
    return res.status(400).json({ error: 'User already exists' }); // Error bhej do - user pehle se hai
  }

  const hashedPassword = await bcryptjs.hash(password, 10); // Password ko secure hash mein convert kar rahe hain
  const user = new User({ email, password: hashedPassword }); // Naya user object bana rahe hain with hashed password
  await user.save(); // User ko database mein save kar rahe hain

  const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' }); // Token generate kar rahe hain (1 hour ke liye valid)
  res.json({ token }); // User ko token bhej rahe hain (authentication ke liye use hoga)
});

// ✅ Login Route
router.post("/auth/login", async (req, res) => { // Jab user login kare
  const { email, password } = req.body; // Email aur password request se le rahe hain

  const user = await User.findOne({ email }); // Database mein user ko dhoondh rahe hain
  if (user && await bcryptjs.compare(password, user.password)) { // Agar user mila aur password match hua
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' }); // Token generate kar rahe hain
    res.json({ token }); // Token bhej rahe hain user ko
  } else { // Agar email ya password galat hai
    res.status(400).json({ error: "Invalid credentials" }); // Error bhej rahe hain
  }
});

// ✅ JWT Middleware (Protected Route ke liye)
function authenticationJWT(req, res, next) { // Middleware function banaya hai
  const authHeader = req.headers.authorization; // Request ke headers se token le rahe hain
  if (!authHeader) return res.sendStatus(401); // Agar token nahi mila to "Unauthorized"

  const token = authHeader.split(' ')[1]; // Token ko "Bearer <token>" format se alag kar rahe hain
  jwt.verify(token, 'secret', (err, user) => { // Token verify kar rahe hain using secret key
    if (err) return res.sendStatus(403); // Agar token galat hai ya expire ho gaya hai to "Forbidden"
    req.user = user; // Token sahi hai to user ki info req object mein daal rahe hain
    next(); // Next middleware ya route chalu karo
  });
}

module.exports = { router, authenticationJWT }; // Router aur middleware ko export kar rahe hain so that app.js ya server.js use kar sake
