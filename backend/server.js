const express = require("express");
const dotenv = require("dotenv").config();

// const connectDb = require("./db/connection");
const mongoose = require("mongoose");
const tasksRoutes = require("./routes/proTasks");
const userRoutes = require("./routes/user");

const cors = require("cors");

const app = express();

// middleware funcs
app.use(express.json());
app.use(cors({}));

app.use(express.json());

app.use(loggerCon);

function loggerCon(req, res, next) {
  console.log(req.path, req.method);
  next();
}

// Main routes
app.use("/api/tasks", tasksRoutes);
app.use("/api/user", userRoutes);

// connect to db
mongoose
  .connect(process.env.DATABSE_CONNECT)
  .then(() => {
    console.log("connected to \x1b[34mMongoDb\x1b[0m");
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log("listening to port:\x1b[33m", process.env.PORT + "\x1b[0m");
    });
  })
  .catch((err) => {
    console.log(err);
  });
