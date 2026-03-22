const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Order counter
let orderCount = 0;

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Save order + send email
app.post("/save-order", async (req, res) => {
  try {
    const { name, phone, product, quantity, beneficiary, amount } = req.body;

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

    // ✅ SEND EMAIL (FIXED)
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["davisnanaidan2@gmail.com"], // 🔥 CHANGE THIS ONLY
      subject: "New Order Received",
      html: `
        <h2>Dav's Cheap Bundles Order</h2>
        <p><b>Order Number:</b> ${orderNumber}</p>
        <p><b>Product:</b> ${product}</p>
        <p><b>Quantity:</b> ${quantity}</p>
        <p><b>Beneficiary:</b> ${beneficiary}</p>
        <p><b>Customer Phone:</b> ${phone}</p>
        <p><b>Amount:</b> GHS ${amount}</p>
        <p><b>Date:</b> ${new Date().toLocaleString()}</p>
      `
    });

    console.log("EMAIL SENT SUCCESSFULLY");

    res.json({
      message: "Order saved + email sent ✅",
      order
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Email failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
