import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function AppLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 w-full overflow-x-hidden px-2 py-2 md:px-8 md:py-6 transition-colors duration-300 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:bg-gradient-to-br light:from-slate-100 light:via-white light:to-slate-100">
        <div className="fixed top-4 right-4 z-50 md:hidden">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
