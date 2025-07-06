import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import Topbar from "../components/Topbar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || ""
      });
    }
  }, []);

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setMessage("Profil został zaktualizowany pomyślnie!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Nowe hasła nie są identyczne");
      setLoading(false);
      return;
    }

    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage("Hasło zostało zmienione pomyślnie!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Topbar 
        title="Profil użytkownika" 
        subtitle="Zarządzaj swoimi danymi osobowymi i ustawieniami"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Dane osobowe</h2>
              <p className="text-slate-600">Aktualizuj swoje informacje</p>
            </div>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="text-green-800 font-medium">{message}</div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="text-red-800 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Imię
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleProfileChange}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nazwisko
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleProfileChange}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              🔒
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Zmiana hasła</h2>
              <p className="text-slate-600">Zaktualizuj swoje hasło</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Obecne hasło
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nowe hasło
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Potwierdź nowe hasło
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Zmienianie..." : "Zmień hasło"}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Wskazówki bezpieczeństwa</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Hasło powinno mieć co najmniej 6 znaków</li>
              <li>• Używaj kombinacji liter, cyfr i znaków specjalnych</li>
              <li>• Nie udostępniaj hasła innym osobom</li>
              <li>• Zmieniaj hasło regularnie</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Informacje o koncie</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-2xl p-4">
            <h4 className="font-semibold text-slate-800 mb-2">Rola</h4>
            <div className="text-slate-600">{user.role}</div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4">
            <h4 className="font-semibold text-slate-800 mb-2">ID użytkownika</h4>
            <div className="text-slate-600 font-mono text-sm">{user.id}</div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4">
            <h4 className="font-semibold text-slate-800 mb-2">Status konta</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-green-600 font-semibold">Aktywne</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}