const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
