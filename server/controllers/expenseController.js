import Expense from "../models/Expense.js";

// @desc Get all expenses
// @route GET /api/expenses
// @access Private
const getExpenses = async (req, res) => {
  try {
    const {
      category,
      type,
      search,
      startDate,
      endDate,
    } = req.query;

    let query = {
      userId: req.user._id,
    };

    // Filters
    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    // Search by title
    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Date filter
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte = new Date(
          startDate
        );
      }

      if (endDate) {
        query.date.$lte = new Date(
          endDate
        );
      }
    }

    const expenses = await Expense.find(query)
      .sort({
        date: -1,
      });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Create expense
// @route POST /api/expenses
// @access Private
const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      type,
    } = req.body;

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      date,
      type,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Update expense
// @route PUT /api/expenses/:id
// @access Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(
      req.params.id
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Check ownership
    if (
      expense.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedExpense =
      await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Delete expense
// @route DELETE /api/expenses/:id
// @access Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(
      req.params.id
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Check ownership
    if (
      expense.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await expense.deleteOne();

    res.json({
      message: "Expense removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};