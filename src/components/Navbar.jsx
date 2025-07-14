import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Navbar() {
  const user = authService.getUser && authService.getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-4 flex justify-between items-center shadow-lg">
      <span className="font-bold text-2xl text-white tracking-wider">TMO</span>
      <div className="flex gap-4">
        <Link to="/" className="text-white font-semibold hover:text-blue-200 transition">Panel</Link>
        <Link to="/uzytkownicy" className="text-white font-semibold hover:text-blue-200 transition">Użytkownicy</Link>
        {user ? (
          <button
            onClick={handleLogout}
            className="text-white font-semibold hover:text-blue-200 transition"
          >
            Wyloguj się
          </button>
        ) : (
          <Link to="/login" className="text-white font-semibold hover:text-blue-200 transition">Logowanie</Link>
        )}
      </div>
    </nav>
  );
}
