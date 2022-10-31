const User = require("../models/userModel");
const Notify = require("../models/notifyModel");
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
    const approve = user.approve;
    const path = user.path;
    res.status(200).json({ email, token, admin, approve, path });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// check all data temporirily
const getAllData = async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).send({ data });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// check all notifications
const getAllNots = async (req, res) => {
  const user_email = req.params.User;
  const admin_id = await User.find({ email: user_email }).select("_id");
  // console.log(admin_id[0]._id.toString());
  const nots = await Notify.find({ admin_id: admin_id[0]._id.toString() });
  // console.log(nots);
  try {
    res.status(200).send(nots);
  } catch (error) {
    res.status(404).json({ error: "No notifications" });
  }
};

// insert Hierarchy
const setHier = async (req, res) => {
  const admin_id = req.params.User;
  console.log(admin_id);

  const parent = await User.findById(admin_id);
  let childPath;
  console.log(parent.email);
  if (parent.path) {
    childPath = parent.path + parent.email + ",";
  } else {
    childPath = "Top," + parent.email + ",";
  }
  const child_id = await User.find({ email: req.body.email }).select("_id");
  console.log(child_id);
  const appr = await User.findByIdAndUpdate(child_id, {
    path: childPath,
  });
  console.log(appr);
  // const Not1 = await User.findOneAndDelete({ _id: admin_id });

  if (!appr) {
    return res.status(400).json({ error: "No such user" });
  }
  res.status(200).json(appr);
};

// delete a notification
const delNots = async (req, res) => {
  const Nots_id = req.params.User;
  console.log(Nots_id);

  const reqr = await Notify.findById(Nots_id);
  console.log(reqr.req_id);
  const appr = await User.findByIdAndUpdate(reqr.req_id, {
    approve: true,
  });
  const Not1 = await Notify.findOneAndDelete({ _id: Nots_id });

  if (!Not1) {
    return res.status(400).json({ error: "No such task" });
  }
  res.status(200).json(appr);
};

// get juniors only
const getJuniors = async (req, res) => {
  const user_email = req.params.User;
  try {
    const data1 = await User.find({ email: user_email });
    const data2 = await User.find({ path: { $regex: user_email } });
    const data = data1.concat(data2);
    res.status(200).send({ data });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// get seniors only
const getSeniors = async (req, res) => {
  const user_email = req.params.User;
  const user_path = await User.find({ email: user_email });
  const sen_path = user_path[0].path;
  const user_arr = sen_path?.split(",");
  // if (user_arr.length > 1) {
  user_arr.shift();
  user_arr.pop();
  console.log(user_arr);
  try {
    const data = await User.find({ email: { $in: user_arr } });
    res.status(200).send({ data });
  } catch (err) {
    res.status(500).json({ message: err });
  }
  // } else {
  //   res.status(200);
  // }
};

// signup user
const signupUser = async (req, res) => {
  const { email, password, admin, approve } = req.body;
  console.log(approve);
  try {
    const user = await User.signup(email, password, admin, approve);

    // fetching and notifying all admins
    const admindata = await User.find({ admin: true, approve: true }).select(
      "_id"
    );
    // creating notifications
    for (let id of admindata) {
      const notreq = await Notify({
        admin_id: id._id,
        req_id: user._id,
        authapp: "Please approve: " + email,
      });
      notreq.save();
    }

    // creating token
    const token = createToken(user._id);

    res.status(200).json({ email, token, admin, approve });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }

  // res.json({ msg: "signup user" });
};

module.exports = {
  getAllData,
  signupUser,
  loginUser,
  getAllNots,
  delNots,
  setHier,
  getJuniors,
  getSeniors,
};
