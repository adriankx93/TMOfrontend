import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import TechniciansPage from "./pages/TechniciansPage";
import ShiftsPage from "./pages/ShiftsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/zadania" element={<TasksPage />} />
          <Route path="/technicy" element={<TechniciansPage />} />
          <Route path="/zmiany" element={<ShiftsPage />} />
          <Route path="/raporty" element={<ReportsPage />} />
          <Route path="/ustawienia" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}