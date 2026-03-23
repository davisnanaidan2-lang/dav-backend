const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* RESEND SETUP */
const resend = new Resend(process.env.RESEND_API_KEY);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend working");
});

/* ORDER ROUTE */
app.post("/order", async (req, res) => {
  try {

    const {
      phone,
      product,
      network,
      quantity,
      beneficiary,
      amount,
      orderNumber
    } = req.body;

    const message = `
NEW ORDER RECEIVED

Order Number: ${orderNumber}
Product: ${product}
Network: ${network}
Quantity: ${quantity}
Beneficiary: ${beneficiary}
Amount: GH₵ ${amount}
Customer Phone: ${phone}
Date: ${new Date().toLocaleString()}
`;

    await resend.emails.send({
      from: "Dav Bundles <onboarding@resend.dev>",
      to: ["davisnanaidan2@gmail.com"],
      subject: "New Order Received",
      text: message,
    });

    console.log("EMAIL SENT SUCCESSFULLY");

    res.status(200).json({ success: true });

  } catch (error) {

    console.log("EMAIL ERROR:", error);

    res.status(500).json({
      error: "Email failed",
      details: error.message
    });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
