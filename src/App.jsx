import React from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Stats from "./components/Stats";
import TicketsTable from "./components/TicketsTable";

export default function App() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 overflow-hidden">
        <Topbar />
        <div className="space-y-8">
          <Stats />
          <TicketsTable />
        </div>
      </main>
    </div>
  );
}