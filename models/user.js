// models/User.js
const mongoose = require("mongoose");
const Model = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  })
); // create model

module.exports = Model;

mongoose.Schema;
