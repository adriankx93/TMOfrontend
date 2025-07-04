import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import EditUserPage from "./pages/EditUserPage";
import ProfilePage from "./pages/ProfilePage";

function NavBar() {
  return (
    <nav className="flex gap-6 bg-blue-700 text-white px-6 py-3 mb-6 shadow-lg">
      <Link to="/dashboard" className="font-bold text-lg">TMO</Link>
      <Link to="/dashboard">Panel</Link>
      <Link to="/users">Użytkownicy</Link>
      <Link to="/profile">Profil</Link>
      <Link to="/login">Logowanie</Link>
    </nav>
  );
}


export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/new" element={<EditUserPage />} />
        <Route path="/users/:id/edit" element={<EditUserPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
