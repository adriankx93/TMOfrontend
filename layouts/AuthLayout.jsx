import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="bg-slate-900 min-h-screen w-full flex items-center justify-center">
      <Outlet />
    </div>
  );
}
