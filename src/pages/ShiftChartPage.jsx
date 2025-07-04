
import Topbar from "../components/Topbar";
import ShiftChart from "../components/ShiftChart";

export default function ShiftChartPage() {
  return (
    <div className="space-y-8">
      <Topbar 
        title="Grafik zmian z arkusza" 
        subtitle="Analiza danych techników i zmian z Google Sheets"
      />
      <ShiftChart />
    </div>
  );
}
