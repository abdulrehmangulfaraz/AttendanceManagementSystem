import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/Auth/login", { email, password });
      login(res.data.token);
      const role = res.data.role;
      if (role === "Admin") navigate("/admin");
      else if (role === "Teacher") navigate("/teacher");
      else if (role === "Student") navigate("/student");
    } catch (err: any) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // BACKGROUND:
    // Light: Radial Gradient from Cream to Stone
    // Dark: Radial Gradient from Deep Midnight Blue to Pure Black
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden transition-all duration-700
            bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
            from-cream-50 to-stone-200 
            dark:from-midnight-900 dark:to-midnight-950"
    >
      {/* Ambient Glow (Behind Card) - Adds the "Shade" effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full 
                bg-white/50 dark:bg-midnight-800/50 backdrop-blur-md 
                text-stone-600 dark:text-slate-400 
                border border-white/60 dark:border-slate-700/50
                shadow-sm hover:shadow-md hover:scale-105 transition-all z-20"
      >
        {theme === "dark" ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
        )}
      </button>

      {/* MAIN CARD */}
      <div
        className="w-full max-w-md p-8 m-4 relative z-10 animate-fade-in
                bg-white/80 dark:bg-midnight-900/80 backdrop-blur-xl
                rounded-3xl 
                border border-white dark:border-slate-800
                shadow-2xl shadow-stone-300/40 dark:shadow-black/50"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 
                        bg-gradient-to-tr from-blue-600 to-indigo-600 
                        shadow-lg shadow-blue-500/30 text-white transform transition hover:rotate-6"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-800 dark:text-white tracking-tight">
            AMS Portal
          </h1>
          <p className="mt-2 text-sm font-medium text-stone-500 dark:text-slate-400">
            Secure Academic Sign In
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 p-4 text-sm rounded-xl border flex items-center
                        bg-red-50 text-red-700 border-red-100 
                        dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30"
          >
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="group">
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-2 
                            text-stone-500 dark:text-slate-400 group-focus-within:text-blue-600 transition-colors"
            >
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300
                            bg-cream-100 dark:bg-midnight-800 
                            border border-transparent focus:border-blue-500 
                            text-stone-800 dark:text-white 
                            placeholder-stone-400 dark:placeholder-slate-500
                            focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20"
              placeholder="name@university.edu"
            />
          </div>

          {/* Password */}
          <div className="group">
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-2 
                            text-stone-500 dark:text-slate-400 group-focus-within:text-blue-600 transition-colors"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300
                                bg-cream-100 dark:bg-midnight-800 
                                border border-transparent focus:border-blue-500 
                                text-stone-800 dark:text-white 
                                placeholder-stone-400 dark:placeholder-slate-500
                                focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20"
                placeholder="Enter password"
              />
              {/* Toggle Eye */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center 
                                text-stone-400 hover:text-stone-600 
                                dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg 
                        bg-gradient-to-r from-blue-600 to-indigo-600 
                        hover:from-blue-700 hover:to-indigo-700 
                        hover:shadow-blue-500/25 hover:-translate-y-0.5
                        transition-all duration-300
                        ${isSubmitting ? "opacity-80 cursor-wait" : ""}`}
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-stone-400 dark:text-slate-600">
            Protected by UET Security Protocol © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
