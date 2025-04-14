const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const Quote = require("./models/quotes.js");
const User = require("./models/user.js");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------[[ Connect to DB first]]----------------------------
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// ----------------------------------------------------[[ Setup ]]---------------------------------------
app.use(cors());

app.use(express.json());

// SESSIONS
app.use(
  session({
    secret: process.env.SESSION_SECRET || "General_Assembly_Bootcamp",
    resave: false,
    saveUninitialized: true, // Ensures session object is initialized
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

// .POST creating a new quote in the database/API
app.post("/quotes", async (req, res) => {
  const createdQuote = await Quote.create(req.body);
  res.json(createdQuote);
});

//.GET a route to find all quote
app.get("/quotes", async (req, res) => {
  const findQuote = await Quote.find();
  res.json(findQuote);
});

app.get("/quote/:quoteId", async (req, res) => {
  const findQuote = await Quote.find({_id: req.params.quoteId});
  res.json(findQuote);
});

//.DELETE route to delete quote data from database.
app.delete("/quote/:quoteId", async (req, res) => {
  const deleteQuote = await Quote.findByIdAndDelete(req.params.quoteId);
  res.json(deleteQuote);
});

//.PUT route for updating quote in  the database
app.put("/quote/:quoteId", async (req, res) => {
  const updateQuote = await Quote.findByIdAndUpdate(
    req.params.quoteId,
    req.body,
    { new: true }
  );
  req.json(updateQuote);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
