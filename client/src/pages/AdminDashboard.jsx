import { CheckCircle2, ShieldCheck, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import DialogBox from "../components/DialogBox";
import taskStyles from "../components/TaskCard.module.css";
import { TASK_STATUS_LABELS } from "../constants/taskOptions";
import adminStyles from "./AdminDashboard.module.css";
import dashboardStyles from "./Dashboard.module.css";

const priorityClasses = {
  low: taskStyles.priorityLow,
  medium: taskStyles.priorityMedium,
  high: taskStyles.priorityHigh,
};

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("tasks");
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        api.get("/admin/tasks"),
        api.get("/admin/users"),
      ]);

      setTasks(tasksResponse.data.tasks);
      setUsers(usersResponse.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/admin/tasks/${taskId}`);
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userToDelete._id}`);
      setUserToDelete(null);
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user");
    }
  };

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const visibleTasks = activeView === "completed" ? completedTasks : tasks;

  const stats = {
    total: tasks.length,
    users: users.length || new Set(tasks.map((task) => task.owner?._id).filter(Boolean)).size,
    completed: completedTasks.length,
  };

  const taskPanelTitle = activeView === "completed" ? "Done Tasks" : "Moderation Queue";
  const taskEmptyText = activeView === "completed" ? "No completed tasks found." : "No tasks found.";

  return (
    <main className={dashboardStyles.dashboard}>
      <section className={dashboardStyles.dashboardHeader}>
        <div>
          <p className={dashboardStyles.eyebrow}>Admin</p>
          <h1>All Tasks</h1>
        </div>
        <div className={dashboardStyles.stats}>
          <span>{stats.total} total</span>
          <span>{stats.users} users</span>
          <span>{stats.completed} done</span>
        </div>
      </section>

      <section className={dashboardStyles.taskPanel}>
        <div className={adminStyles.adminToolbar}>
          <div className={adminStyles.adminPanelTitle}>
            {activeView === "users" ? <Users size={20} /> : <ShieldCheck size={20} />}
            <h2>{activeView === "users" ? "Users" : taskPanelTitle}</h2>
          </div>

          <div className={adminStyles.viewTabs} aria-label="Admin views">
            <button
              className={activeView === "tasks" ? adminStyles.activeTab : ""}
              onClick={() => setActiveView("tasks")}
              type="button"
            >
              <ShieldCheck size={16} />
              <span>Tasks</span>
            </button>
            <button
              className={activeView === "completed" ? adminStyles.activeTab : ""}
              onClick={() => setActiveView("completed")}
              type="button"
            >
              <CheckCircle2 size={16} />
              <span>Done</span>
            </button>
            <button
              className={activeView === "users" ? adminStyles.activeTab : ""}
              onClick={() => setActiveView("users")}
              type="button"
            >
              <Users size={16} />
              <span>Users</span>
            </button>
          </div>
        </div>

        <div className={dashboardStyles.taskListViewport}>
          {error && <p className={dashboardStyles.errorText}>{error}</p>}
          {loading ? (
            <p className={dashboardStyles.emptyState}>Loading admin dashboard...</p>
          ) : activeView === "users" ? (
            users.length ? (
              <div className={adminStyles.userList}>
                {users.map((user) => (
                  <article className={adminStyles.userRow} key={user._id}>
                    <div>
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                    </div>
                    <div className={adminStyles.userMeta}>
                      <span>{user.role}</span>
                      <span>{user.totalTasks} tasks</span>
                      <span>{user.completedTasks} done</span>
                      <span>
                        Joined{" "}
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <button
                      className={`${adminStyles.dangerButton} ${adminStyles.iconTextButton}`}
                      disabled={user.role === "admin"}
                      onClick={() => setUserToDelete(user)}
                      type="button"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className={dashboardStyles.emptyState}>No users found.</p>
            )
          ) : visibleTasks.length ? (
            <div className={dashboardStyles.taskList}>
              {visibleTasks.map((task) => (
                <article className={taskStyles.taskCard} key={task._id}>
                  <div className={taskStyles.taskCardHeader}>
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.description || "No description added."}</p>
                    </div>
                    <span className={`${taskStyles.priority} ${priorityClasses[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className={taskStyles.taskMeta}>
                    <span>{TASK_STATUS_LABELS[task.status]}</span>
                    <span>{task.owner?.name || "Unknown user"}</span>
                    <span>{task.owner?.email || "No email"}</span>
                    <span>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                    </span>
                  </div>
                  <div className={taskStyles.taskActions}>
                    <button
                      className={`${adminStyles.dangerButton} ${adminStyles.iconTextButton}`}
                      onClick={() => handleDelete(task._id)}
                      type="button"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={dashboardStyles.emptyState}>{taskEmptyText}</p>
          )}
        </div>
      </section>

      <DialogBox
        confirmText="Delete user"
        isOpen={Boolean(userToDelete)}
        message={
          userToDelete
            ? `Delete ${userToDelete.name}? This also removes all tasks owned by this user.`
            : ""
        }
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete user"
      />
    </main>
  );
};

export default AdminDashboard;
