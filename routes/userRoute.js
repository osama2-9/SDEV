const express = require("express");
const {
  signup,
  login,
  addIncome,
  expense,
  currentMonthExpenses,
  expenseStats,
  currentMonthStats,
} = require("../controller/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/addIncome", addIncome);
router.post("/addExpens", expense);
router.get("/currentMonthExpenses/:userId", currentMonthExpenses);
router.get("/currentMonthStatus/:userId", currentMonthStats);
router.get("/expensesStatus/:userId", expenseStats);

module.exports = router;
