const express = require("express");
const taskController = require("../controllers/task.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);
router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
