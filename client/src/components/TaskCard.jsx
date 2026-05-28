import { TASK_STATUS_LABELS, TASK_STATUS_OPTIONS } from "../constants/taskOptions";
import styles from "./TaskCard.module.css";

const priorityClasses = {
  low: styles.priorityLow,
  medium: styles.priorityMedium,
  high: styles.priorityHigh,
};

const TaskCard = ({ task, onDelete, onEdit, onStatusChange }) => {
  return (
    <article className={styles.taskCard}>
      <div className={styles.taskCardHeader}>
        <div>
          <h3>{task.title}</h3>
          <p>{task.description || "No description added."}</p>
        </div>
        <span className={`${styles.priority} ${priorityClasses[task.priority]}`}>{task.priority}</span>
      </div>
      <div className={styles.taskMeta}>
        <span>{TASK_STATUS_LABELS[task.status]}</span>
        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
      </div>
      <div className={styles.taskActions}>
        <select
          aria-label="Change status"
          onChange={(event) => onStatusChange(task, event.target.value)}
          value={task.status}
        >
          {TASK_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className={styles.ghostButton} onClick={() => onEdit(task)} type="button">
          Edit
        </button>
        <button className={styles.dangerButton} onClick={() => onDelete(task._id)} type="button">
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
