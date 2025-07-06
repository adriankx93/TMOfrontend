import React from "react";
import Topbar from "../components/Topbar";
import BuildingOverview from "../components/BuildingOverview";

export default function BuildingsPage() {
  return (
    <div className="space-y-8">
      <Topbar 
        title="Struktura kompleksu" 
        subtitle="Budynki, piętra i infrastruktura Miasteczka Orange"
      />
      <BuildingOverview />
    </div>
  );
}