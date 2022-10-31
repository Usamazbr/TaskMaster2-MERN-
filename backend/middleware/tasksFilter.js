const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// User token authentication
const tasksFilter = async (req, res, next) => {
  // console.log(req.body);
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Token required" });
  }
  const token = authorization.split(" ")[1];
  // req.body.members.emails
  // extract array of ids =
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    // console.log(_id);
    req.user = await User.findOne({ _id }).select("_id");
    // console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = tasksFilter;
