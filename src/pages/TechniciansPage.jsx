import Topbar from "../components/Topbar";
import TechniciansList from "../components/TechniciansList";

export default function TechniciansPage() {
  return (
    <div className="space-y-8">
      <Topbar 
        title="Zarządzanie technikami" 
        subtitle="Monitoruj status i zadania techników"
      />
      <TechniciansList />
    </div>
  );
}