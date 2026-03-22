const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// ===== CONNECT DATABASE
mongoose.connect(process.env.MONGO_URL || "", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err.message));

// ===== SCHEMA
const orderSchema = new mongoose.Schema({
  orderNumber: String,
  name: String,
  phone: String,
  product: String,
  quantity: Number,
  beneficiary: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

// ===== TEST
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// ===== SAVE ORDER
app.post("/save-order", async (req, res) => {
  try {
    const { name, phone, product, quantity, beneficiary, amount } = req.body;

    const count = await Order.countDocuments({ phone });

    const orderNumber = `DC-${phone}-${count + 1}`;

    const newOrder = new Order({
      orderNumber,
      name,
      phone,
      product,
      quantity,
      beneficiary,
      amount
    });

    await newOrder.save();

    res.json({
      message: "Order saved successfully ✅",
      order: newOrder
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== START SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
