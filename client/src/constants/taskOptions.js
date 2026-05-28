export const TASK_STATUS_OPTIONS = [
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

export const TASK_FILTER_OPTIONS = [{ label: "All", value: "all" }, ...TASK_STATUS_OPTIONS];

export const TASK_STATUS_LABELS = TASK_STATUS_OPTIONS.reduce((labels, option) => {
  labels[option.value] = option.label;
  return labels;
}, {});

export const TASK_PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];
