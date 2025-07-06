import React from "react";
import Topbar from "../components/Topbar";
import BuildingOverview from "../components/BuildingOverview";

export default function BuildingsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Infrastruktura budynków" 
        subtitle="System CAFM - Computer Aided Facility Management"
        action={
          <button className="btn-primary flex items-center gap-2">
            <span>📊</span>
            <span>Raport infrastruktury</span>
          </button>
        }
      />
      
      {/* Quick Building Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
              8
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Budynki</h3>
          <p className="text-slate-400 text-sm">Łączna liczba obiektów</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
              98%
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Sprawność</h3>
          <p className="text-slate-400 text-sm">Systemy operacyjne</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
              5
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Konserwacje</h3>
          <p className="text-slate-400 text-sm">Zaplanowane na dziś</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
              15.2k
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Powierzchnia</h3>
          <p className="text-slate-400 text-sm">m² całkowita</p>
        </div>
      </div>

      <BuildingOverview />
    </div>
  );
}