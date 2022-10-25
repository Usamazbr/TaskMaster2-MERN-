const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// create token function
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // creating token
    const token = createToken(user._id);

    const admin = user.admin;
    res.status(200).json({ email, token, admin });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }

  // res.json({ msg: "login user" });
};

// check all data temporirily
const getAllData = async (req, res) => {
  try {
    const data = await User.find({}).select("_id");
    res.status(200).send({ data });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, password, admin } = req.body;

  try {
    const user = await User.signup(email, password, admin);

    // creating token
    const token = createToken(user._id);
    // console.log(token);
    res.status(200).json({ email, token, admin });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }

  // res.json({ msg: "signup user" });
};

module.exports = { getAllData, signupUser, loginUser };
