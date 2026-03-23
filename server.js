import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/order", async (req, res) => {

try {

const {
phone,
product,
network,
quantity,
beneficiary,
amount
} = req.body;

/* FIXED VALUES */
const ben = beneficiary && beneficiary.trim() !== "" ? beneficiary : "Not Provided";
const qty = quantity && quantity > 0 ? quantity : 1;

const orderId = "DC-" + phone + "-" + Math.floor(Math.random()*1000);

const emailHTML = `
<h2>Dav's Cheap Bundles</h2>

<p><b>Order Number:</b> ${orderId}</p>
<p><b>Product:</b> ${product}</p>
<p><b>Network:</b> ${network}</p>
<p><b>Quantity:</b> ${qty}</p>
<p><b>Beneficiary:</b> ${ben}</p>
<p><b>Phone:</b> ${phone}</p>
<p><b>Amount:</b> GHS ${amount}</p>
<p><b>Date:</b> ${new Date().toLocaleString()}</p>
`;

const response = await fetch("https://api.resend.com/emails", {
method: "POST",
headers: {
"Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
"Content-Type": "application/json"
},
body: JSON.stringify({
from: "Dav Bundles <onboarding@resend.dev>",
to: ["davisnanaidan2@gmail.com"], // 🔥 PUT YOUR REAL EMAIL HERE
subject: "New Order Received",
html: emailHTML
})
});

const data = await response.json();

res.json({
message: "Email sent",
data
});

} catch (err) {
res.status(500).json({error: err.message});
}

});

app.listen(3000, () => {
console.log("Server running");
});
