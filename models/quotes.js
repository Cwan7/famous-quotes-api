const mongoose = require("mongoose");

const quoteSchema = mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: "Unknown",
  },
  image: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This basically lets the schema know that this 'user' property in the 'quoteSchema' is a reference to a user item in another model called 'User'
    required: true,
  },
});
const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
