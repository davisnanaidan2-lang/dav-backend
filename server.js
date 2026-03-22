const express = require("express");
const app = express();

app.use(express.json());

// ===== SAFE DATABASE SETUP =====
let mongoose;
let Order;

try {
  mongoose = require("mongoose");

  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    product: String,
    amount: Number,
    date: { type: Date, default: Date.now }
  });

  Order = mongoose.model("Order", orderSchema);

  console.log("MongoDB setup done");

} catch (err) {
  console.log("MongoDB FAILED:", err.message);
}

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// ===== SAVE ORDER =====
app.post("/save-order", async (req, res) => {
  try {
    const { name, phone, product, amount } = req.body;

    // If DB works → save
    if (Order) {
      const newOrder = new Order({
        name,
        phone,
        product,
        amount
      });

      await newOrder.save();
    }

    // Always respond (VERY IMPORTANT)
    res.json({
      message: "Order received ✅",
      data: { name, phone, product, amount }
    });

  } catch (err) {
    console.log("SAVE ERROR:", err.message);

    res.status(500).json({
      error: err.message
    });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
