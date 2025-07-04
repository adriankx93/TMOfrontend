import Topbar from "../components/Topbar";
import ShiftSchedule from "../components/ShiftSchedule";

export default function ShiftsPage() {
  return (
    <div className="space-y-8">
      <Topbar 
        title="Harmonogram zmian" 
        subtitle="Zarządzaj zmianami dzienną (7:00-19:00) i nocną (19:00-7:00)"
      />
      <ShiftSchedule />
    </div>
  );
}