const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 🔥 DEBUG: check API key
console.log("API KEY:", process.env.RESEND_API_KEY);

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

    console.log("Trying to send email...");

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["davisnanaidan@gmail.com"], // CHANGE THIS
      subject: "Test Order",
      html: `<p>Order ${orderNumber}</p>`
    });

    console.log("EMAIL RESPONSE:", emailResponse);

    res.json({
      message: "Email attempted",
      emailResponse
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      error: "Email failed",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
