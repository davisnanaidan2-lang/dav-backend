const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

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

    console.log("Sending email...");

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",

      // 🔥 VERY IMPORTANT (MUST BE YOUR RESEND ACCOUNT EMAIL)
      to: ["davisnanaidan2@gmail.com"],

      subject: "New Order Received",
      html: `
        <h2>Dav's Cheap Bundles</h2>
        <p><b>Order Number:</b> ${orderNumber}</p>
        <p><b>Product:</b> ${product}</p>
        <p><b>Quantity:</b> ${quantity}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Amount:</b> GHS ${amount}</p>
      `
    });

    console.log("EMAIL RESPONSE:", response);

    res.json({
      message: "Email sent ✅",
      response
    });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      error: "Email failed",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
