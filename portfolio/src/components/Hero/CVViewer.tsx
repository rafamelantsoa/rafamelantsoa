import { useEffect, useState } from "react";

import {
  PDFViewer,
  ScrollStrategy,
} from "@embedpdf/react-pdf-viewer";

import {
  getHero,
  type Hero as HeroData,
} from "../Hero/heroApi";

const CVViewer = () => {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================================
  // CHARGEMENT DU PDF
  // ==========================================================================

  useEffect(() => {
    let cancelled = false;

    const loadCV = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHero();

        if (cancelled) return;

        if (!data.cvUrl) {
          throw new Error("Aucun CV disponible.");
        }

        setHero(data);
        setPdfUrl(data.cvUrl);
      } catch (err) {
        console.error("Erreur CV :", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Impossible de charger le CV."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCV();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================================
  // FERMER
  // ==========================================================================

  const handleClose = () => {
    window.close();
  };

  // ==========================================================================
  // LOADING
  // ==========================================================================

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-4
              h-8
              w-8
              rounded-full
              border-2
              border-zinc-700
              border-t-primary
              animate-spin
            "
          />

          <p className="text-sm text-zinc-500">
            Chargement du CV…
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // ERROR
  // ==========================================================================

  if (error || !hero?.cvUrl || !pdfUrl) {
    return (
      <div className="h-screen w-full bg-[#09090b] flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <p className="text-sm text-zinc-400">
            {error || "Aucun CV disponible."}
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="
              mt-6
              rounded-lg
              bg-primary
              px-6
              py-2.5
              text-sm
              font-medium
              text-white
              cursor-pointer
              transition-opacity
              hover:opacity-90
            "
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEWER
  // ==========================================================================

  return (
    <div
      className="
        h-screen
        w-full
        bg-[#09090b]
        overflow-hidden
      "
    >
      <div
        className="
          h-full
          w-full
          bg-[#18181b]
        "
      >
        <PDFViewer
          config={{
            src: pdfUrl,

            // ----------------------------------------------------------------
            // THÈME
            // ----------------------------------------------------------------

            theme: {
              preference: "dark",
            },

            // ----------------------------------------------------------------
            // SCROLL
            // ----------------------------------------------------------------

            scroll: {
              defaultStrategy: ScrollStrategy.Vertical,
              defaultPageGap: 20,
            },

            // ----------------------------------------------------------------
            // BARRE D'ONGLETS
            // ----------------------------------------------------------------

            tabBar: "never",
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default CVViewer;