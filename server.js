const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// 🔗 CONNECT TO MONGODB
mongoose.connect(mongodb+srv://davisnanaidan:Davis1708@davscheapbundles.s8ktpdd.mongodb.net/?appName=DavsCheapBundles)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// 📦 ORDER SCHEMA
const Order = mongoose.model("Order", {
  customerNumber: String,
  beneficiary: String,
  product: String,
  quantity: Number,
  amount: Number,
  orderCount: Number,
  orderNumber: String,
  date: String
});

// 🚀 CREATE ORDER
app.post("/order", async (req, res) => {

  const { customerNumber, beneficiary, product, quantity, amount } = req.body;

  let existing = await Order.find({ customerNumber });

  let orderCount = existing.length + 1;

  let padded = String(orderCount).padStart(4, "0");
  let orderNumber = `DC-${customerNumber}-${padded}`;

  let date = new Date().toDateString();

  const newOrder = new Order({
    customerNumber,
    beneficiary,
    product,
    quantity,
    amount,
    orderCount,
    orderNumber,
    date
  });

  await newOrder.save();

  res.send({
    success: true,
    orderNumber,
    date
  });

});

app.listen(3000, () => console.log("Server running"));
