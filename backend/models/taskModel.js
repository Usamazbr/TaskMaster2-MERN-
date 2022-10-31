const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: false,
    },
    team: {
      type: String,
      require: true,
    },
    prior: {
      type: Number,
      required: true,
    },
    ongoing: {
      type: Boolean,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    protask: {
      type: Boolean,
      required: false,
    },
    notf_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      required: true,
    },
    // comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
