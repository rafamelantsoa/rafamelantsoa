import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={38}
            className="animate-spin text-[#2464cc]"
          />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vérification de la session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;