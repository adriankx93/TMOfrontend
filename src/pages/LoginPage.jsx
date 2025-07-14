import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

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
      <div className="bg-[#202b40]/90 backdrop-blur-2xl border border-[#3656a6]/30 shadow-xl rounded-3xl px-8 py-10 sm:py-12 flex flex-col items-center animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 via-red-600 to-purple-700 flex items-center justify-center mb-3 shadow-xl ring-2 ring-blue-400/40">
            <span className="text-white text-4xl font-bold select-none">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent tracking-tight">
            TECH-SPIE
          </h1>
          <p className="text-base text-slate-300 mt-1 font-medium">
            Miasteczko Orange – Logowanie
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full mb-6 p-3 bg-red-950/80 border border-red-400/40 rounded-xl text-red-300 text-center font-semibold shadow">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Login</label>
            <div className="flex items-center bg-slate-800/90 rounded-xl border-2 border-slate-700 focus-within:border-blue-500 shadow-inner transition-all">
              <span className="pl-4 pr-2">
                <Mail className="w-5 h-5 text-blue-400" />
              </span>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 py-3 px-2 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
                placeholder="Wprowadź login"
                required
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Hasło</label>
            <div className="flex items-center bg-slate-800/90 rounded-xl border-2 border-slate-700 focus-within:border-blue-500 shadow-inner transition-all">
              <span className="pl-4 pr-2">
                <Lock className="w-5 h-5 text-blue-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 py-3 px-2 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
                placeholder="Wprowadź hasło"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="px-4 text-blue-300 hover:text-blue-500 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link to="/reset-password" className="text-xs text-blue-400 hover:underline font-semibold">
                Nie pamiętasz hasła?
              </Link>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.025] hover:from-blue-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg tracking-wide flex items-center justify-center"
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
        <div className="mt-8 p-4 bg-slate-800/80 rounded-xl border border-blue-600/30 shadow text-center w-full">
          <div className="text-sm text-blue-300 font-semibold mb-2">Dane testowe:</div>
          <div className="text-sm text-blue-200 space-y-1">
            <div>Login: <strong className="font-bold text-white">tester</strong></div>
            <div>Hasło: <strong className="font-bold text-white">test1234</strong></div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-slate-500 tracking-wider">
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
