import { AlertTriangle, X } from "lucide-react";
import styles from "./DialogBox.module.css";

const DialogBox = ({
  cancelText = "Cancel",
  confirmText = "Confirm",
  isOpen,
  message,
  onCancel,
  onConfirm,
  title,
  variant = "danger",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onCancel}>
      <section
        aria-labelledby="dialog-title"
        aria-modal="true"
        className={styles.dialog}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button className={styles.closeButton} onClick={onCancel} type="button" aria-label="Close">
          <X size={18} />
        </button>

        <div className={`${styles.iconBadge} ${styles[variant]}`}>
          <AlertTriangle size={22} />
        </div>

        <div className={styles.content}>
          <h2 id="dialog-title">{title}</h2>
          <p>{message}</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel} type="button">
            {cancelText}
          </button>
          <button className={styles.confirmButton} onClick={onConfirm} type="button">
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DialogBox;
