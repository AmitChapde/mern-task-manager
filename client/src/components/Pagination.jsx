import styles from "./Pagination.module.css";

const Pagination = ({ page, pages, onChange }) => {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        type="button"
      >
        Previous
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button
        className={styles.paginationButton}
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        type="button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
