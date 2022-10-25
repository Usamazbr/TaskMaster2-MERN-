const express = require("express");
const router = express.Router();

// controller functions
const {
  getAllData,
  signupUser,
  loginUser,
} = require("../controllers/userController");

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// check data (temp)
router.route("/data").get(getAllData);

module.exports = router;
