import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Signup.module.css";

const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className={styles.authPage}>
      <div className={styles.authStack}>
        <form className={styles.authCard} onSubmit={handleSubmit}>
          <h1>Signup</h1>
          {error && <p className={styles.errorText}>{error}</p>}
          <label>
            <span>Name</span>
            <input name="name" onChange={updateField} required value={form.name} />
          </label>
          <label>
            <span>Email</span>
            <input name="email" onChange={updateField} required type="email" value={form.email} />
          </label>
          <label>
            <span>Password</span>
            <div className={styles.passwordField}>
              <input
                minLength="6"
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
            {loading ? "Creating..." : "Create Account"}
          </button>
          <p>
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Signup;
