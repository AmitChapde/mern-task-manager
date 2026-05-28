const Task = require("../models/task.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

const adminDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted by admin" });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const [users, taskStats] = await Promise.all([
      User.find().select("name email role createdAt").sort({ createdAt: -1 }),
      Task.aggregate([
        {
          $group: {
            _id: "$owner",
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: {
                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const statsByUserId = new Map(taskStats.map((item) => [String(item._id), item]));

    const usersWithStats = users.map((user) => {
      const stats = statsByUserId.get(String(user._id));

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        totalTasks: stats?.totalTasks || 0,
        completedTasks: stats?.completedTasks || 0,
      };
    });

    res.json({ users: usersWithStats });
  } catch (error) {
    next(error);
  }
};

const adminDeleteUser = async (req, res, next) => {
  try {
    if (String(req.user.id) === String(req.params.id)) {
      throw new ApiError(400, "You cannot delete your own admin account");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role === "admin") {
      throw new ApiError(400, "Admin accounts cannot be deleted from this dashboard");
    }

    await Promise.all([Task.deleteMany({ owner: user._id }), User.findByIdAndDelete(user._id)]);

    res.json({ message: "User and their tasks deleted by admin" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  adminDeleteTask,
  getUsers,
  adminDeleteUser,
};
