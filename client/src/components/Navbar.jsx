import { LogOut, Moon, ShieldCheck, Sun, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.navbar}>
      <Link className={styles.brand} to="/">
        TaskFlow
      </Link>
      <nav className={styles.navLinks}>
        {user ? (
          <>
            {user.role?.toLowerCase() === "admin" && (
              <NavLink
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
                to="/admin"
              >
                <ShieldCheck size={16} />
                <span>Admin</span>
              </NavLink>
            )}
            <button
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className={styles.iconButton}
              onClick={toggleTheme}
              title={theme === "light" ? "Dark mode" : "Light mode"}
              type="button"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <span className={styles.userChip}>
              <User size={16} />
              {user.name}
            </span>
            <button
              className={`${styles.primaryButton} ${styles.iconTextButton}`}
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
              to="/signup"
            >
              Signup
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
