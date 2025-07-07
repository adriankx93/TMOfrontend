import { useState } from "react";
import Topbar from "../components/Topbar";
import TechniciansFromSheets from "../components/TechniciansFromSheets";

export default function TechniciansPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zespół techników" 
        subtitle="Zarządzanie zespołem i przypisywanie zadań"
        action={
          <button className="btn-primary flex items-center gap-2">
            <span>👷</span>
            <span>Dodaj technika</span>
          </button>
        }
      />

      <TechniciansFromSheets />
    </div>
  );
}