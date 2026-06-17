import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Entertainment",
      ],
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model(
  "Expense",
  expenseSchema
);

export default Expense;