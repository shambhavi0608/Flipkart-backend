const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Import authentication routes and middleware
const { router: authRoutes, authenticateJWT } = require("./auth");

// ✅ Import cart routes
const cartRoutes = require("./cart");

// ✅ Import Product model (make sure you have this file)
const Product = require("./models/Product");

// ✅ Use the routes
app.use(authRoutes);
app.use(cartRoutes);

// ✅ MongoDB connection
mongoose.connect(
  "mongodb+srv://trivedishambhavi5:Yellow123%21%40%23@cluster0.xo0diyp.mongodb.net/Ecommerce",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => console.log("MongoDB Connected"))
 .catch(err => console.error("MongoDB connection error:", err));

// ✅ Route to get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "There is an internal server error" });
  }
});

// ✅ Route to get single product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    if (!products) {
      return res.status(404).json({ message: "The item you were searching for does not exist" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:8080`);
});
