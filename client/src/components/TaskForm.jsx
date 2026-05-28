import { useEffect, useState } from "react";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "../constants/taskOptions";
import styles from "./TaskForm.module.css";

const initialState = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

const today = new Date().toISOString().slice(0, 10);

const TaskForm = ({ editingTask, onCancel, onSubmit }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(initialState);
    }
  }, [editingTask]);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      dueDate: form.dueDate || undefined,
    });
    setForm(initialState);
  };

  return (
    <form className={styles.taskForm} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <label>
          <span>Title</span>
          <input
            name="title"
            onChange={updateField}
            placeholder="Design onboarding"
            required
            value={form.title}
          />
        </label>
        <label>
          <span>Due date</span>
          <input name="dueDate" min={today} onChange={updateField} type="date" value={form.dueDate} />
        </label>
      </div>
      <label>
        <span>Description</span>
        <textarea
          name="description"
          onChange={updateField}
          placeholder="Add useful context"
          rows="3"
          value={form.description}
        />
      </label>
      <div className={styles.formRow}>
        <label>
          <span>Status</span>
          <select name="status" onChange={updateField} value={form.status}>
            {TASK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Priority</span>
          <select name="priority" onChange={updateField} value={form.priority}>
            {TASK_PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.formActions}>
        {editingTask && (
          <button className={styles.ghostButton} onClick={onCancel} type="button">
            Cancel
          </button>
        )}
        <button className={styles.primaryButton} type="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
