const mongoose = require("mongoose");

async function dbConnect() {
  try {
    await mongoose.connect(
      "mongodb+srv://sdev:sdev@cluster0.1pfss.mongodb.net/"
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

module.exports = dbConnect;
