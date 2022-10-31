const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
      // maxlength: [50, "Name must be less than 50 Char"],
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      required: true,
    },
    approve: {
      type: Boolean,
      required: true,
    },
    path: {
      type: String,
      required: false,
    },
    // notifies:[{}],
  },
  {
    timestamps: true,
  }
);

// signup
userSchema.statics.signup = async function (email, password, admin, approve) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }
  const already = await this.findOne({ email });
  if (already) {
    throw Error("Email is already in use");
  }

  //hash
  const enrate = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, enrate);

  //creating user
  const user = await this.create({ email, password: hash, admin, approve });

  return user;
};

// login
userSchema.statics.login = async function (email, password) {
  // console.log("usamadsafdgsadaesf");
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const already = await this.findOne({ email });
  if (!already) {
    throw Error("Incorrect email");
  }
  const compare = await bcrypt.compare(password, already.password);
  if (!compare) {
    throw Error("Incorrect password");
  }
  return already;
};

module.exports = mongoose.model("User", userSchema);
