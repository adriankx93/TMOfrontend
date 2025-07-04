import Topbar from "../components/Topbar";
import Stats from "../components/Stats";
import ShiftOverview from "../components/ShiftOverview";
import TasksOverview from "../components/TasksOverview";
import TechniciansStatus from "../components/TechniciansStatus";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <Topbar title="Dashboard" subtitle="Przegląd systemu Miasteczko Orange" />
      <Stats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ShiftOverview />
        <TechniciansStatus />
      </div>
      <TasksOverview />
    </div>
  );
}