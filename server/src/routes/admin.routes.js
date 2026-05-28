const express = require("express");
const adminController = require("../controllers/admin.controller");
const protect = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const router = express.Router();

router.use(protect);
router.use(allowRoles("admin"));

router.get("/tasks", adminController.getAllTasks);
router.delete("/tasks/:id", adminController.adminDeleteTask);
router.get("/users", adminController.getUsers);
router.delete("/users/:id", adminController.adminDeleteUser);

module.exports = router;
