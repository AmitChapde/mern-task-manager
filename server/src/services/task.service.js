const Task = require("../models/task.model");
const ApiError = require("../utils/ApiError");

const getTasks = async (userId, query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 3, 1), 50);
  const skip = (page - 1) * limit;

  const filters = { owner: userId };

  if (query.status && query.status !== "all") {
    filters.status = query.status;
  }

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  const [tasks, total] = await Promise.all([
    Task.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filters),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    },
  };
};

const createTask = (userId, payload) => {
  return Task.create({ ...payload, owner: userId });
};

const updateTask = async (userId, taskId, payload) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: userId },
    payload,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

const deleteTask = async (userId, taskId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, owner: userId });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
