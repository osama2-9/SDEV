const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  income: {
    type: Number,
    default: 0,
  },
  expense: [expenseSchema], 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
