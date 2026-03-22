const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// Order counter (simple memory system)
let orderCount = 0;

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

    // 📧 SEND EMAIL
    await resend.emails.send({
      from: "Dav Bundles <onboarding@resend.dev>",
      to: [davisnanaidan2@gmail.com"], // 🔥 CHANGE THIS
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

    res.json({ order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving order" });
  }
});

app.listen(3000, () => console.log("Server running..."));
