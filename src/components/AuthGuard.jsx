import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export default function AuthGuard({ children }) {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = authService.getToken();
    const publicPaths = ["/login", "/register", "/reset-password"];

    if (!token && !publicPaths.some((p) => location.pathname.startsWith(p))) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    } else {
      setChecked(true);
    }
  }, [location.pathname, navigate]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return children;
}
