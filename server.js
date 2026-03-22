const express = require("express");
const app = express();

app.use(express.json());

// ===== TEMP STORAGE (acts like database for now)
let orders = [];

// ===== TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// ===== SAVE ORDER WITH ORDER NUMBER
app.post("/save-order", (req, res) => {
  try {
    const { name, phone, product, amount } = req.body;

    // Count how many times this number has ordered
    const userOrders = orders.filter(o => o.phone === phone);
    const orderCount = userOrders.length + 1;

    // Create Order Number
    const orderNumber = `DC-${phone}-${orderCount}`;

    const newOrder = {
      orderNumber,
      name,
      phone,
      product,
      amount,
      date: new Date()
    };

    orders.push(newOrder);

    res.json({
      message: "Order received ✅",
      order: newOrder
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ===== START SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
