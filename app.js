require("dotenv/config");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

// Connect to MONGODB
mongoose.connect(process.env.MONGO_URI, () => {
  console.log("Connected to Database!");
});

app.use("/", indexRouter);

//catch when when request match no route
app.use((req, res, next) => {
  const exception = new Error(`Path not found`);
  exception.statusCode = 404;
  next(exception);
});

//customize express error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
