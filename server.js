const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const resend = new Resend(process.env.RESEND_API_KEY);

let orderCount = 0;

app.post("/save-order", async (req, res) => {
  try {
    const { name, phone, product, quantity, beneficiary, amount } = req.body;

    // ✅ Validate input
    if (!phone || !product || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    orderCount++;

    const orderNumber = `DC-${phone}-${orderCount}`;

    const order = {
      orderNumber,
      name,
      phone,
      product,
      quantity,
      beneficiary,
      amount,
      date: new Date()
    };

    console.log("ORDER RECEIVED:", order);

    // ✅ SEND EMAIL
    const response = await resend.emails.send({
      from: "Dav Bundles <onboarding@resend.dev>",
      to: ["davisnanaidan2@gmail.com"], // 🔥 CHANGE THIS
      subject: "New Order Received",
      html: `
        <h2>New Order</h2>
        <p><b>Order No:</b> ${orderNumber}</p>
        <p><b>Product:</b> ${product}</p>
        <p><b>Quantity:</b> ${quantity}</p>
        <p><b>Beneficiary:</b> ${beneficiary}</p>
        <p><b>Customer:</b> ${phone}</p>
        <p><b>Amount:</b> GHS ${amount}</p>
      `
    });

    console.log("EMAIL SENT:", response);

    res.json({ order });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
