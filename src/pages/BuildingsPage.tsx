import React from "react";
import Topbar from "../components/Topbar";
import BuildingOverview from "../components/BuildingOverview";
import SurfaceSummaryCard from "../components/SurfaceSummaryCard";

const metrics = [
  {
    icon: "🏢",
    value: "8",
    label: "Budynki",
    desc: "Łączna liczba obiektów",
    bg: "bg-blue-500/20",
    text: "text-blue-400",
  },
  {
    icon: "⚡",
    value: "98%",
    label: "Sprawność",
    desc: "Systemy operacyjne",
    bg: "bg-green-500/20",
    text: "text-green-400",
  },
  {
    icon: "🔧",
    value: "5",
    label: "Konserwacje",
    desc: "Zaplanowane na dziś",
    bg: "bg-amber-500/20",
    text: "text-amber-400",
  },
  {
    icon: "📊",
    value: "15.2k",
    label: "Powierzchnia",
    desc: "m² całkowita",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
  },
];

export default function BuildingsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar
        title="Infrastruktura budynków"
        subtitle="System CAFM - Computer Aided Facility Management"
        action={
          <button
            type="button"
            aria-label="Pobierz raport infrastruktury"
            className="btn-primary flex items-center gap-2"
          >
            <span>📊</span>
            <span>Raport infrastruktury</span>
          </button>
        }
      />

      {/* Ogólne zestawienie powierzchni, kubatur i wskaźników */}
      <SurfaceSummaryCard />

      {/* Quick Building Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div
            className="bg-slate-900 rounded-2xl shadow p-6 metric-card"
            key={i}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${metric.bg} rounded-xl flex items-center justify-center`}
              >
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div
                className={`px-3 py-1 ${metric.bg} ${metric.text} rounded-full text-sm font-bold`}
              >
                {metric.value}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {metric.label}
            </h3>
            <p className="text-slate-400 text-sm">{metric.desc}</p>
          </div>
        ))}
      </div>

      <BuildingOverview />
    </div>
  );
}
