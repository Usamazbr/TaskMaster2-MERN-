const express = require("express");
const {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
  completeTask,
  deltNots2,
} = require("../controllers/taskController");
const tasksFilter = require("../middleware/tasksFilter");

const router = express.Router();

// middleware for token auth
router.use(tasksFilter);

// GET all tasks
router.get("/", getTasks);

// POST a new task
router.post("/", createTask);

// ID requests
router.route("/:Taskid").get(getTask).delete(deleteTask).patch(updateTask);

// Notify
router.route("/Nots/:User").delete(deltNots2);

// Is compplete
router.route("/:Taskid/:togglecomplete").patch(completeTask);

module.exports = router;
