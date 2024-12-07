const User = require("../model/User.js");
const jwt = require("jsonwebtoken");
const secret = "jwtcode";

const signup = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;
    if (!fullname || !username || !password) {
      return res.status(400).json({
        error: "Please fill all feilds",
      });
    }

    const sameUsername = await User.findOne({ username: username });
    if (sameUsername) {
      return res.status(400).json({
        error: "the username already exisit",
      });
    }

    const newUser = new User({
      fullname,
      username,
      password,
    });

    await newUser.save();

    return res.status(200).json({
      message: "Signup success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        error: "Please enter username and password",
      });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });

    res.cookie("auth", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const addIncome = async (req, res) => {
  try {
    const { userId, income } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        error: "No user found",
      });
    }
    user.income += income;
    await user.save();

    res.status(200).json({ message: "Income added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const expense = async (req, res) => {
  try {
    const { userId, type, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.expense.push({ type, amount });
    await user.save();
    res.status(200).json({
      message: "Expense added successfully",
      expenses: user.expense,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
const currentMonthExpenses = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthExpenses = user.expense.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    res.status(200).json({
      message: "Current month expenses ",
      expenses: currentMonthExpenses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
const currentMonthStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthExpenses = user.expense.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const totalExpense = currentMonthExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    const remainingIncome = user.income - totalExpense;
    const averageDailyExpense =
      currentMonthExpenses.length > 0
        ? totalExpense / currentMonthExpenses.length
        : 0;

    res.status(200).json({
      message: "Current month stats ",
      stats: {
        totalExpense,
        remainingIncome,
        averageDailyExpense,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const expenseStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthExpenses = user.expense.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const expenseStats = currentMonthExpenses.reduce((stats, expense) => {
      stats[expense.type] = stats[expense.type] || 0;
      stats[expense.type] += expense.amount;
      return stats;
    }, {});

    res.status(200).json({
      message: "Expense stats by type ",
      stats: expenseStats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  signup,
  login,
  addIncome,
  expense,
  currentMonthExpenses,
  expenseStats,
  currentMonthStats,
};
