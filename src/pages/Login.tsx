import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      navigate("/");
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setFormData({ username: "", email: "", password: "" });
    setError("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Mode Toggle */}
        <div className="flex mb-8 shadow-[4px_4px_0_0_var(--shadow-color)]">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-3 font-bold transition-all shadow-none ${
              mode === "login"
                ? "bg-[var(--accent-primary)] text-black"
                : "bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-3 font-bold transition-all border-l-2 border-[var(--border-color)] ${
              mode === "register"
                ? "bg-[var(--accent-primary)] text-black"
                : "bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] shadow-[6px_6px_0_0_var(--shadow-color)] p-8">
          <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username (Register only) */}
            {mode === "register" && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-bold mb-2 text-[var(--text-primary)]"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required={mode === "register"}
                  className="w-full"
                  placeholder="Enter your username"
                />
              </div>
            )}

            {/* Email / Username */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold mb-2 text-[var(--text-primary)]"
              >
                {mode === "login" ? "Username or Email" : "Email"}
              </label>
              <input
                type={mode === "login" ? "text" : "email"}
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full"
                placeholder={
                  mode === "login"
                    ? "Enter your username or email"
                    : "Enter your email"
                }
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-2 text-[var(--text-primary)]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full"
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent-primary)] text-black py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          {/* Demo Credentials */}
          {mode === "login" && (
            <div className="mt-6 p-4 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
              <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2">
                Demo Credentials
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-[var(--text-secondary)]">
                  <span className="font-semibold">Username:</span> demo
                </p>
                <p className="text-[var(--text-secondary)]">
                  <span className="font-semibold">Password:</span> 1234
                </p>
              </div>
            </div>
          )}

          {/* Toggle Link */}
          <div className="mt-6 text-center">
            <p className="text-[var(--text-secondary)]">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-[var(--accent-primary)] font-bold hover:underline"
              >
                {mode === "login" ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
