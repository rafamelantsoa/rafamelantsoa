import React, {
  useEffect,
  useState,
} from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  AnimatePresence,
} from "framer-motion";

import App from "./App";
import "./index.css";

import {
  ThemeProvider,
} from "./context/ThemeContext";

import {
  initLenis,
} from "./lib/lenis";

import PageLoader from "./components/PageLoader";

function Bootstrap() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initLenis();

    const startApplication = async () => {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
      } catch (error) {
        console.error(
          "Erreur lors du démarrage de l'application :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    startApplication();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader />}
      </AnimatePresence>

      {!loading && (
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      )}
    </>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Bootstrap />
  </React.StrictMode>
);