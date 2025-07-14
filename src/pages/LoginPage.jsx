import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { Eye, EyeOff, Mail, Lock, Sun, Moon } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="backdrop-blur-2xl shadow-xl rounded-3xl px-8 py-10 sm:py-12 flex flex-col items-center animate-fade-in-up transition-colors duration-300 dark:bg-[#202b40]/90 dark:border dark:border-[#3656a6]/30 light:bg-white/90 light:border light:border-slate-200/50">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 via-red-600 to-purple-700 flex items-center justify-center mb-3 shadow-xl ring-2 ring-blue-400/40">
            <span className="text-white text-4xl font-bold select-none">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 dark:from-blue-400 dark:to-blue-700 light:from-blue-500 light:to-blue-800 bg-clip-text text-transparent tracking-tight">
            TECH-SPIE
          </h1>
          <p className="text-base dark:text-slate-300 light:text-slate-600 mt-1 font-medium">
            Miasteczko Orange – Logowanie
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full mb-6 p-3 dark:bg-red-950/80 dark:border-red-400/40 dark:text-red-300 light:bg-red-50 light:border-red-200 light:text-red-700 border rounded-xl text-center font-semibold shadow">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold dark:text-slate-300 light:text-slate-700 mb-2">Login</label>
            <div className="flex items-center dark:bg-slate-800/90 light:bg-white rounded-xl border-2 dark:border-slate-700 light:border-slate-200 focus-within:border-blue-500 shadow-inner transition-all">
              <span className="pl-4 pr-2 transition-colors">
                <Mail className="w-5 h-5 dark:text-blue-400 light:text-blue-600" />
              </span>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 py-3 px-2 bg-transparent dark:text-slate-100 light:text-slate-800 dark:placeholder-slate-500 light:placeholder-slate-400 focus:outline-none font-medium"
                placeholder="Wprowadź login"
                required
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold dark:text-slate-300 light:text-slate-700 mb-2">Hasło</label>
            <div className="flex items-center dark:bg-slate-800/90 light:bg-white rounded-xl border-2 dark:border-slate-700 light:border-slate-200 focus-within:border-blue-500 shadow-inner transition-all">
              <span className="pl-4 pr-2 transition-colors">
                <Lock className="w-5 h-5 dark:text-blue-400 light:text-blue-600" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 py-3 px-2 bg-transparent dark:text-slate-100 light:text-slate-800 dark:placeholder-slate-500 light:placeholder-slate-400 focus:outline-none font-medium"
                placeholder="Wprowadź hasło"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="px-4 dark:text-blue-300 light:text-blue-600 dark:hover:text-blue-500 light:hover:text-blue-800 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link to="/reset-password" className="text-xs dark:text-blue-400 light:text-blue-600 hover:underline font-semibold">
                Nie pamiętasz hasła?
              </Link>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r dark:from-blue-600 dark:to-blue-400 light:from-blue-700 light:to-blue-500 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.025] dark:hover:from-blue-700 light:hover:from-blue-800 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg tracking-wide flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Logowanie...
              </span>
            ) : (
              "Zaloguj się"
            )}
          </button>
        </form>

        {/* Test credentials */}
        <div className="mt-8 p-4 dark:bg-slate-800/80 light:bg-blue-50/80 rounded-xl dark:border-blue-600/30 light:border-blue-200 border shadow text-center w-full">
          <div className="text-sm dark:text-blue-300 light:text-blue-700 font-semibold mb-2">Dane testowe:</div>
          <div className="text-sm dark:text-blue-200 light:text-blue-600 space-y-1">
            <div>Login: <strong className="font-bold dark:text-white light:text-blue-900">tester</strong></div>
            <div>Hasło: <strong className="font-bold dark:text-white light:text-blue-900">test1234</strong></div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs dark:text-slate-500 light:text-slate-400 tracking-wider">
          © {new Date().getFullYear()} TECH SPIE Polska. Wszystkie prawa zastrzeżone.<br />
          Designed & developed by Adrian Kicior
        </div>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.21,0.72,0.7,1.13);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98);}
          to   { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </div>
  );
}
