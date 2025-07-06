import { useEffect, useState } from "react";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { authService } from "./services/authService";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";

import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import ShiftsPage from "./pages/ShiftsPage";
import ShiftChartPage from "./pages/ShiftChartPage";
import CurrentMonthPage from "./pages/CurrentMonthPage";
import TechniciansPage from "./pages/TechniciansPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import EditUserPage from "./pages/EditUserPage";
import InventoryPage from "./pages/InventoryPage";
import MaterialsPage from "./pages/MaterialsPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/zadania" element={<TasksPage />} />
          <Route path="/shifts" element={<ShiftsPage />} />
          <Route path="/magazyn" element={<InventoryPage />} />
          <Route path="/materialy" element={<MaterialsPage />} />
          <Route path="/current-month" element={<CurrentMonthPage />} />
          <Route path="/technicians" element={<TechniciansPage />} />
          <Route path="/raporty" element={<ReportsPage />} />
          <Route path="/ustawienia" element={<SettingsPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/uzytkownicy" element={<UsersPage />} />
          <Route path="/uzytkownicy/:id" element={<EditUserPage />} />
        </Routes>
      </main>
    </div>
  );
}
