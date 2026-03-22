const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
