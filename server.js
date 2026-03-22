const express = require("express");
const app = express();

app.use(express.json());

// SIMPLE TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// SAVE ORDER (NO DATABASE FOR NOW)
app.post("/save-order", (req, res) => {
  try {
    const { name, phone, product, amount } = req.body;

    res.json({
      message: "Order received ✅",
      data: { name, phone, product, amount }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 IMPORTANT: USE RAILWAY PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
