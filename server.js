const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/* EMAIL SETUP */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
      orderNumber,
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Order",
      text: message,
    });

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Email failed" });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
