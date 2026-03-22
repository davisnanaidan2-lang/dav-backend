const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Order = require("./models/Order");

const app = express();

app.use(cors());
app.use(express.json());
// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.post("/save-order", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.send("Order saved successfully ✅");
  } catch (err) {
    res.status(500).send("Error saving order");
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
