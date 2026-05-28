import { TASK_FILTER_OPTIONS } from "../constants/taskOptions";
import styles from "./FilterTabs.module.css";

const FilterTabs = ({ active, onChange }) => {
  return (
    <div className={styles.filterTabs} role="tablist" aria-label="Task status">
      {TASK_FILTER_OPTIONS.map((tab) => (
        <button
          aria-selected={active === tab.value}
          className={active === tab.value ? `${styles.tabButton} ${styles.active}` : styles.tabButton}
          key={tab.value}
          onClick={() => onChange(tab.value)}
          role="tab"
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
