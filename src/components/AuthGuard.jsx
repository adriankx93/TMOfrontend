import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = () => {
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    setIsLoading(false);

    // Redirect to login if not authenticated and not already on login or register page
    if (!isAuth && 
        !location.pathname.includes('/login') && 
        !location.pathname.includes('/register')) {
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If on login or register page, or if authenticated, render children
  if (location.pathname.includes('/login') || 
      location.pathname.includes('/register') || 
      isAuthenticated) {
    return children;
  }

  // This should not be reached due to the redirect in checkAuth
  return null;
}