const express = require("express");
const dbConnect = require("./db");
const router = require("./routes/userRoute.js");

const app = express();
const PORT = 4000;

dbConnect();

app.use(express.json());

app.use("/user", router);

app.listen(PORT, () => {
  console.log(`Server work`);
});
