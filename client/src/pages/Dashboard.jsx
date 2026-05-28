import { useEffect, useState } from "react";
import api from "../api/axios";
import FilterTabs from "../components/FilterTabs";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/tasks", {
        params: { status, search, page },
      });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(fetchTasks, 250);
    return () => clearTimeout(handle);
  }, [status, search, page]);

  const handleSubmit = async (payload) => {
    if (editingTask) {
      await api.patch(`/tasks/${editingTask._id}`, payload);
      setEditingTask(null);
    } else {
      await api.post("/tasks", payload);
    }
    setPage(1);
    await fetchTasks();
  };

  const handleDelete = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    await fetchTasks();
  };

  const handleStatusChange = async (task, nextStatus) => {
    await api.patch(`/tasks/${task._id}`, { status: nextStatus });
    await fetchTasks();
  };

  const stats = {
    total: pagination.total,
    open: tasks.filter((task) => task.status !== "completed").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };

  return (
    <main className={styles.dashboard}>
      <section className={styles.dashboardHeader}>
        <div>
          <p className={styles.eyebrow}>Workspace</p>
          <h1>Task Dashboard</h1>
        </div>
        <div className={styles.stats}>
          <span>{stats.total} total</span>
          <span>{stats.open} open</span>
          <span>{stats.completed} done</span>
        </div>
      </section>

      <section className={styles.dashboardGrid}>
        <aside className={styles.panel}>
          <h2>{editingTask ? "Edit Task" : "New Task"}</h2>
          <TaskForm
            editingTask={editingTask}
            onCancel={() => setEditingTask(null)}
            onSubmit={handleSubmit}
          />
        </aside>

        <section className={styles.taskPanel}>
          <div className={styles.taskToolbar}>
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
            <FilterTabs
              active={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
          </div>

          <div className={styles.taskListViewport}>
            {error && <p className={styles.errorText}>{error}</p>}
            {loading ? (
              <p className={styles.emptyState}>Loading tasks...</p>
            ) : tasks.length ? (
              <div className={styles.taskList}>
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    onDelete={handleDelete}
                    onEdit={setEditingTask}
                    onStatusChange={handleStatusChange}
                    task={task}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No tasks match the current view.</p>
            )}
          </div>

          <Pagination page={page} pages={pagination.pages} onChange={setPage} />
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
