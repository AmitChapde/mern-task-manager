import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";

const Login = () => {
  const { login, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form);
      const requestedPath = location.state?.from?.pathname;
      const nextPath = requestedPath || (user.role?.toLowerCase() === "admin" ? "/admin" : "/");

      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className={styles.authPage}>
      <div className={styles.authStack}>
        <form className={styles.authCard} onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <p className={styles.errorText}>{error}</p>}
          <label>
            <span>Email</span>
            <input name="email" onChange={updateField} required type="email" value={form.email} />
          </label>
          <label>
            <span>Password</span>
            <div className={styles.passwordField}>
              <input
                name="password"
                onChange={updateField}
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                title={showPassword ? "Hide password" : "Show password"}
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <button className={styles.primaryButton} disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
          <p>
            Need an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
        <p className={styles.demoAdminNote}>
          Admin demo login: <strong>admin@demo.com</strong> / <strong>admin123</strong>
        </p>
      </div>
    </main>
  );
};

export default Login;
