import React from "react";
import Topbar from "../components/Topbar";
import CurrentMonthChart from "../components/CurrentMonthChart";

export default function CurrentMonthPage() {
  return (
    <div className="space-y-8">
      <Topbar 
        title="Aktualny miesiąc" 
        subtitle="Grafik zmian z arkusza Google Sheets"
      />
      <CurrentMonthChart />
    </div>
  );
}