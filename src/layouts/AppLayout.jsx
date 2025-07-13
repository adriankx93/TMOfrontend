import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 w-full overflow-x-hidden px-2 py-2 md:px-8 md:py-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
