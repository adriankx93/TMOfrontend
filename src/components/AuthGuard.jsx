import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export default function AuthGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = authService.getToken();
    setIsLoading(false);

    // Jeśli nie ma tokena, przekieruj do login
    if (
      !token &&
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/register")
    ) {
      navigate("/login", { state: { from: location.pathname } });
    }
    // jeśli masz token, nic nie rób
  }, [location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Jeżeli jesteś na login/register lub masz token, pokaż dzieci
  const token = authService.getToken();
  if (
    location.pathname.includes("/login") ||
    location.pathname.includes("/register") ||
    token
  ) {
    return children;
  }

  // (Teoretycznie już przekierowało)
  return null;
}
