import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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

    if (!phone || !product || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

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
      from: `"Dav's Cheap Bundles" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Order Received",
      text: message,
    });

    console.log("EMAIL SENT SUCCESSFULLY");

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("EMAIL ERROR:", error);

    res.status(500).json({
      error: "Email failed",
      details: error.message,
    });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
