import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register" | "mfa">(initialMode);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
  });
  const [mfaCode, setMfaCode] = useState("");
  const [displayMfaToken, setDisplayMfaToken] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register, verifyMFA, mfaState, cancelMFA } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login(formData.username, formData.password);
        navigate("/");
      } else if (mode === "register") {
        const result = await register(
          formData.username,
          formData.password,
          formData.phoneNumber
        );
        if (result.requiresMFA && result.mfaToken) {
          setDisplayMfaToken(result.mfaToken);
          setMode("mfa");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMFASubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await verifyMFA(parseInt(mfaCode, 10));
      navigate("/");
    } catch (error) {
      console.error("MFA verification error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("MFA verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelMFA = () => {
    cancelMFA();
    setMode("register");
    setMfaCode("");
    setDisplayMfaToken(null);
    setError("");
  };

  const toggleMode = () => {
    const newMode = mode === "login" ? "register" : "login";
    setMode(newMode);
    setFormData({ username: "", password: "", phoneNumber: "" });
    setError("");
  };

  // MFA Verification Screen
  if (mode === "mfa" || mfaState.pending) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] shadow-[6px_6px_0_0_var(--shadow-color)] p-8">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">
              Verify Your Account
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              Enter the 6-digit verification code to complete registration.
            </p>

            {/* Display MFA Token for testing */}
            {displayMfaToken && (
              <div className="mb-6 p-4 bg-[var(--accent-primary)] border-2 border-black">
                <h3 className="font-bold text-sm text-black mb-1">
                  Your Verification Code (for testing):
                </h3>
                <p className="text-2xl font-mono font-bold text-black">
                  {displayMfaToken}
                </p>
              </div>
            )}

            <form onSubmit={handleMFASubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="mfaCode"
                  className="block text-sm font-bold mb-2 text-[var(--text-primary)]"
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  id="mfaCode"
                  value={mfaCode}
                  onChange={(e) =>
                    setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  maxLength={6}
                  className="w-full text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 text-sm font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || mfaCode.length !== 6}
                className="w-full bg-[var(--accent-primary)] text-black py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Complete Registration"}
              </button>

              <button
                type="button"
                onClick={handleCancelMFA}
                className="w-full bg-[var(--button-bg)] text-[var(--text-primary)] py-3 border-2 border-[var(--border-color)] font-bold hover:bg-[var(--bg-secondary)] transition-all"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Username */}
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
                required
                className="w-full"
                placeholder="Enter your username"
              />
            </div>

            {/* Phone Number (Register only) */}
            {mode === "register" && (
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-bold mb-2 text-[var(--text-primary)]"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required={mode === "register"}
                  className="w-full"
                  placeholder="Enter your phone number"
                />
              </div>
            )}

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
