import { Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300 dark:bg-[#151c2c] light:bg-[#f0f4f8]">
      {/* Efekt gridu */}
      <svg className="absolute inset-0 w-full h-full dark:opacity-20 light:opacity-10 pointer-events-none select-none z-0" viewBox="0 0 1920 1080">
        <defs>
          <pattern id="tinyGrid" width="36" height="36" patternUnits="userSpaceOnUse" className="transition-colors duration-300">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="currentColor" className="dark:text-blue-600 light:text-blue-300" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tinyGrid)" />
      </svg>
      {/* Delikatne, duże, rozmyte blobsy */}
      <div className="absolute left-[-15%] top-[-10%] w-[500px] h-[430px] rounded-full bg-gradient-to-br from-blue-700 via-indigo-600 to-pink-500 blur-[160px] dark:opacity-25 light:opacity-15 z-0" />
      <div className="absolute right-[-12%] bottom-[-14%] w-[390px] h-[320px] rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 blur-[120px] dark:opacity-20 light:opacity-10 z-0" />
      
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <main className="relative z-10 w-full max-w-md flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
