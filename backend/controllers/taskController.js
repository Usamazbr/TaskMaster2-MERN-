const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const Notify = require("../models/notifyModel");

// get all Tasks
const getTasks = async (req, res) => {
  const user_id = req.user._id;
  const tasks = await Task.find({ user_id }).sort({
    protask: -1,
    completed: 1,
    prior: 1,
    updatedAt: 1,
  });
  try {
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a notification
const deltNots2 = async (req, res) => {
  const Nots_id = req.params.User;

  const taskp = await Task.findOneAndUpdate(
    { notf_id: Nots_id },
    {
      approved: true,
    },
    { returnOriginal: false }
  );
  console.log(taskp);
  if (!taskp) {
    return res.status(400).json({ error: "Failed to approve" });
  }
  const Not1 = await Notify.findOneAndDelete({ _id: Nots_id });

  if (!Not1) {
    return res.status(400).json({ error: "No such task" });
  }
  res.status(200).json(taskp);
};

// get a single Task
const getTask = async (req, res) => {
  const { Taskid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(Taskid)) {
    return res.status(404).json({ error: "No such task" });
  }

  const task = await Task.findById(Taskid);

  if (!task) {
    return res.status(404).json({ error: "No such task" });
  }

  res.status(200).json(task);
};

// create a new Task
const createTask = async (req, res) => {
  const {
    title,
    details,
    team,
    prior,
    ongoing,
    completed,
    protask,
    selected,
    approved,
    selected2,
  } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!team) {
    emptyFields.push("team");
  }
  if (!prior) {
    emptyFields.push("priority");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  let notf_id;

  let selfassigned = false;
  if (protask === true) {
    for (let id of selected) {
      if (selected2) {
        const notreq = await Notify({
          admin_id: selected2._id,
          req_id: id._id,
          taskapp: "Please approve task of: " + id.email,
        });
        notreq.save();
        console.log(notreq._id);
        notf_id = notreq._id;
      }
      // Database
      const mtask = await Task({
        title,
        details,
        team,
        prior,
        ongoing,
        completed,
        notf_id,
        user_id: id._id,
        protask,
        approved,
      });
      mtask.save();
      // creating notifications
      if (req.user._id.valueOf() === id._id) {
        selfassigned = mtask;
      }
    }

    if (selfassigned) {
      res.status(200).json(selfassigned);
    } else {
      return res
        .status(405)
        .json({ error: "Warning: Not self assigned", emptyFields });
    }
  } else {
    try {
      const user_id = req.user._id;

      const task = await Task.create({
        title,
        details,
        team,
        prior,
        ongoing,
        completed,
        user_id,
        protask,
        approved: true,
      });

      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// delete a Task
const deleteTask = async (req, res) => {
  const { Taskid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(Taskid)) {
    return res.status(404).json({ error: "Object ID is not valid" });
  }

  const task = await Task.findOneAndDelete({ _id: Taskid });

  if (!task) {
    return res.status(400).json({ error: "No such task" });
  }
  res.status(200).json(task);
};

// update a Task
const updateTask = async (req, res) => {
  const { Taskid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(Taskid)) {
    return res.status(400).json({ error: "Object ID is not valid" });
  }

  const task = await Task.findOneAndUpdate(
    { _id: Taskid },
    {
      ...req.body,
    }
  );

  if (!task) {
    return res.status(404).json({ error: "No such task" });
  }

  res.status(200).json(task);
};

// complete Task
const completeTask = async (req, res) => {
  const { Taskid, togglecomplete } = req.params;
  if (!mongoose.Types.ObjectId.isValid(Taskid)) {
    return res.status(400).json({ error: "Object ID is not valid" });
  }
  const task = await Task.findById(Taskid);
  Task.findOne;
  // if (togglecomplete === "completed") {
  const ctask = await Task.findByIdAndUpdate(Taskid, {
    completed: !task.completed,
    ongoing: !task.ongoing,
  });
  // }
  if (!task) {
    return res.status(404).json({ error: "No such task" });
  }

  res.status(200).json(ctask);
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
  completeTask,
  deltNots2,
};
