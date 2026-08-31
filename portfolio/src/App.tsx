import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Portfolio from "./pages/Portfolio";
import PortfolioRealisations from "./pages/Portfolio-realisation";
import ProjectDetail from "./components/Realisations/ProjectDetail";

import CVViewer from "./components/Hero/CVViewer";

import CustomCursor from "./components/CustomCursor";

function App() {
  return (
    <>
    <CustomCursor />
      <Routes>
        <Route
          path="/"
          element={<Portfolio />}
        />

          <Route path="/cv-Rafamelantsoa" element={<CVViewer />} />

        <Route
          path="/portfolio"
          element={<PortfolioRealisations />}
        />

        <Route
          path="/realisations/:id"
          element={<ProjectDetail />}
        />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}

export default App;