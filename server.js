const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// Store customer order counts
const customerOrders = {};

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.post("/save-order", async (req, res) => {
  try {
    const { name, phone, product, quantity, beneficiary, amount } = req.body;

    if (!phone || !product || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Track how many times this customer has ordered
    if (!customerOrders[phone]) {
      customerOrders[phone] = 0;
    }

    customerOrders[phone]++;

    const orderNumber = `DC-${phone}-${customerOrders[phone]}`;

    const orderDate = new Date().toLocaleString();

    // Send Email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["davisnanaidan2@gmail.com"], // 🔥 PUT YOUR REAL EMAIL
      subject: "🛒 New Order Received",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #0a66c2;">Dav's Cheap Bundles</h2>

          <p>Your order has been received and is being processed.</p>

          <hr/>

          <p><b>ORDER NUMBER:</b> ${orderNumber}</p>
          <p><b>ORDER DATE:</b> ${orderDate}</p>
          <p><b>PRODUCT:</b> ${product}</p>
          <p><b>QUANTITY:</b> ${quantity || 1}</p>
          <p><b>BENEFICIARY NUMBER:</b> ${beneficiary || phone}</p>
          <p><b>CUSTOMER NUMBER:</b> ${phone}</p>
          <p><b>AMOUNT:</b> GHS ${amount}</p>

          <hr/>

          <p style="color: green;"><b>Status:</b> Processing</p>

          <p>Thank you for choosing Dav's Cheap Bundles 💙</p>
        </div>
      `
    });

    res.json({
      message: "Order saved + email sent ✅",
      order: {
        orderNumber,
        orderDate,
        product,
        quantity: quantity || 1,
        phone,
        amount
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
