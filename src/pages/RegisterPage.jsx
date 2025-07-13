import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }
    if (formData.password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      alert("Rejestracja zakończona pomyślnie. Możesz się teraz zalogować.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-lg border border-slate-700 rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ring-2 ring-blue-400/40">
          <span className="text-white text-3xl font-bold drop-shadow-[0_1px_6px_rgba(0,0,0,0.25)]">T</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent drop-shadow">
          TECH-SPIE
        </h1>
        <p className="text-slate-300 mt-2">Miasteczko Orange – Rejestracja</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/60 border border-red-400/40 rounded-2xl">
          <div className="text-red-300 font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Imię</label>
          <div className="flex items-center bg-slate-800 rounded-2xl border border-slate-600 focus-within:border-blue-500 transition-all">
            <span className="pl-4 pr-2">
              <User className="w-5 h-5 text-blue-400" />
            </span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="flex-1 p-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              placeholder="Wprowadź imię"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Nazwisko</label>
          <div className="flex items-center bg-slate-800 rounded-2xl border border-slate-600 focus-within:border-blue-500 transition-all">
            <span className="pl-4 pr-2">
              <User className="w-5 h-5 text-blue-400" />
            </span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="flex-1 p-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              placeholder="Wprowadź nazwisko"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
          <div className="flex items-center bg-slate-800 rounded-2xl border border-slate-600 focus-within:border-blue-500 transition-all">
            <span className="pl-4 pr-2">
              <Mail className="w-5 h-5 text-blue-400" />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 p-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              placeholder="Wprowadź email"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Hasło</label>
          <div className="flex items-center bg-slate-800 rounded-2xl border border-slate-600 focus-within:border-blue-500 transition-all">
            <span className="pl-4 pr-2">
              <Lock className="w-5 h-5 text-blue-400" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 p-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              placeholder="Wprowadź hasło"
              required
              disabled={loading}
              minLength={6}
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
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Potwierdź hasło</label>
          <div className="flex items-center bg-slate-800 rounded-2xl border border-slate-600 focus-within:border-blue-500 transition-all">
            <span className="pl-4 pr-2">
              <Lock className="w-5 h-5 text-blue-400" />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="flex-1 p-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              placeholder="Potwierdź hasło"
              required
              disabled={loading}
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="px-4 text-blue-300 hover:text-blue-500 transition-colors"
              tabIndex={-1}
              aria-label={showConfirm ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.025] hover:from-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
        >
          {loading ? "Rejestracja..." : "Zarejestruj się"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-400">
          Masz już konto?{" "}
          <Link to="/login" className="text-blue-400 hover:underline font-semibold">
            Zaloguj się
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500 tracking-wider">
        © {new Date().getFullYear()} TECH SPIE Polska. Wszystkie prawa zastrzeżone. Designed and developed by Adrian Kicior ©
      </div>
    </div>
  );
}
