import Topbar from "../components/Topbar";
import TechniciansFromSheets from "../components/TechniciansFromSheets";

export default function TechniciansPage() {
  return (
    <div className="space-y-8">
      <Topbar 
        title="Zespół techników" 
        subtitle="Dane techników z arkusza Google Sheets"
      />
      <TechniciansFromSheets />
    </div>
  );
}