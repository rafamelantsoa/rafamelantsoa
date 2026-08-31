import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie.");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f6f3ee] to-[#eef4ff] text-zinc-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header
          className="
            sticky
            top-0
            z-30
            flex
            h-16
            shrink-0
            items-center
            justify-between
            border-b
            border-white/60
            bg-white/80
            px-6
            backdrop-blur-md
            md:px-8
          "
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#2464cc]" />

            <div>
              <p className="text-sm font-semibold text-zinc-800">
                Portfolio
              </p>

              <p className="text-xs text-zinc-500">
                Espace administration
              </p>
            </div>
          </div>

          {/* Right */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-100
              bg-white/80
              px-4
              py-2
              text-sm
              font-medium
              text-red-600
              transition-all
              duration-200
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-700
              focus:outline-none
              focus:ring-2
              focus:ring-red-500/30
              active:scale-[0.98]
            "
          >
            <LogOut
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            <span>Déconnexion</span>
          </button>
        </header>

        {/* Content */}
        <main
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-6
            pb-10
            pt-8
            md:px-10
          "
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}