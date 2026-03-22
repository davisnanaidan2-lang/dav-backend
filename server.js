const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ Order Schema
const Order = mongoose.model("Order", {
  name: String,
  phone: String,
  product: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Save Order Route
app.post("/save-order", async (req, res) => {
  try {
    const { name, phone, product, amount } = req.body;

    const newOrder = new Order({
      name,
      phone,
      product,
      amount
    });

    await newOrder.save();

    res.json({
      message: "Order saved successfully ✅",
      order: newOrder
    });

  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
