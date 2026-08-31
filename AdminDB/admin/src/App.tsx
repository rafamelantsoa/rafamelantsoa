import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/dashboard";

import HeroManagement from "./pages/Hero/HeroManagement";
import AboutManagement from "./pages/About/AboutManagement";
import ExperienceManagement from "./pages/Experiences/ExperienceManagement";
import ContactManagement from "./pages/ContactManagement/ContactManagement";
import FooterManagement from "./pages/Footer/FooterManagement";
import RealisationsManagement from "./pages/Realisations/RealisationsManagement";
import WorkManagement from "./pages/Work/WorkManagement";
import Abstract from "./pages/AbstractCaroussel/AbstractCarouselManagement";

import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <Routes>
        {/* ============================================================
            LOGIN
        ============================================================ */}
        <Route path="/login" element={<Login />} />

        {/* ============================================================
            ADMIN DASHBOARD PROTÉGÉ
        ============================================================ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* Hero */}
            <Route
              path="/HeroManagement"
              element={<HeroManagement />}
            />

            {/* About */}
            <Route
              path="/AboutManagement"
              element={<AboutManagement />}
            />

            {/* Experiences */}
            <Route
              path="/Experiences"
              element={<ExperienceManagement />}
            />

            {/* Contact */}
            <Route
              path="/Contact"
              element={<ContactManagement />}
            />

            {/* Footer */}
            <Route
              path="/footer"
              element={<FooterManagement />}
            />

            {/* Réalisations */}
            <Route
              path="/realisations"
              element={<RealisationsManagement />}
            />

            {/* Work / Statistiques */}
            <Route
              path="/stats"
              element={<WorkManagement />}
            />

            {/* Abstract Carousel */}
            <Route
              path="/abstract"
              element={<Abstract />}
            />
          </Route>
        </Route>

        {/* ============================================================
            ROUTE INCONNUE
        ============================================================ */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {/* ==============================================================
          TOASTER
      ============================================================== */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
}