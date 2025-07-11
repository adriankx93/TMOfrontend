import { useEffect, useState } from "react";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

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
import BuildingsPage from "./pages/BuildingsPage";
import InspectionsPage from "./pages/InspectionsPage";
import DefectsPage from "./pages/DefectsPage";
import EquipmentPage from "./pages/EquipmentPage";
import ToolsPage from "./pages/ToolsPage";
import NotebookPage from "./pages/NotebookPage";
import TrendAnalysisPage from "./pages/TrendAnalysisPage";
import ProtokolGenerator from "./components/ProtokolGenerator";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row min-h-screen w-full">
        <Sidebar />
        <main className={`flex-1 w-full overflow-x-hidden ${
          isMobile ? 'pt-8 px-1 py-1' : 'px-4 md:px-8 py-6'
        } bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`}>
          <div className="w-full max-w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/zadania" element={<TasksPage />} />
              <Route path="/budynki" element={<BuildingsPage />} />
              <Route path="/shifts" element={<ShiftsPage />} />
              <Route path="/magazyn" element={<InventoryPage />} />
              <Route path="/materialy" element={<MaterialsPage />} />
              <Route path="/current-month" element={<CurrentMonthPage />} />
              <Route path="/technicians" element={<TechniciansPage />} />
              <Route path="/technicy" element={<TechniciansPage />} />
              <Route path="/raporty" element={<ReportsPage />} />
              <Route path="/przeglady" element={<InspectionsPage />} />
              <Route path="/usterki" element={<DefectsPage />} />
              <Route path="/urzadzenia" element={<EquipmentPage />} />
              <Route path="/narzedzia" element={<ToolsPage />} />
              <Route path="/notatnik" element={<NotebookPage />} />
              <Route path="/analiza-trendow" element={<TrendAnalysisPage />} />
              <Route path="/ustawienia" element={<SettingsPage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/uzytkownicy" element={<UsersPage />} />
              <Route path="/uzytkownicy/:id" element={<EditUserPage />} />
              <Route path="/protokol" element={<ProtokolGenerator />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}