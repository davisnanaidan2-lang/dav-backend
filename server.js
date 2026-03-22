const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();

// ✅ VERY IMPORTANT FOR RAILWAY
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Check API key exists
if (!process.env.RESEND_API_KEY) {
  console.log("❌ RESEND API KEY MISSING");
}

const resend = new Resend(process.env.RESEND_API_KEY);

let orderCount = 0;

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.post("/save-order", async (req, res) => {
  try {
    const { name, phone, product, quantity, beneficiary, amount } = req.body;

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

    console.log("ORDER:", order);

    // ✅ SEND EMAIL
    await resend.emails.send({
      from: "Dav Bundles <onboarding@resend.dev>",
      to: ["yourrealemail@gmail.com"], // CHANGE THIS
      subject: "New Order",
      html: `
        <h2>Order Received</h2>
        <p><b>Order No:</b> ${orderNumber}</p>
        <p><b>Product:</b> ${product}</p>
        <p><b>Quantity:</b> ${quantity}</p>
        <p><b>Beneficiary:</b> ${beneficiary}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Amount:</b> GHS ${amount}</p>
      `
    });

    res.json({
      message: "Order + Email sent ✅",
      order
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
