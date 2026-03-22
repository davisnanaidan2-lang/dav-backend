const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ Safe MongoDB connection (won’t crash server)
mongoose.connect(process.env.MONGO_URL || "", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err.message));

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
  res.send("Backend is working ✅");
});

// ✅ Save Order
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
      message: "Order saved ✅",
      order: newOrder
    });

  } catch (err) {
    console.log("SAVE ERROR:", err.message);

    res.status(500).json({
      error: err.message
    });
  }
});

// ✅ Start server (Railway fix)
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
