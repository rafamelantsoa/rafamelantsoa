import { useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Lock,
  LogIn,
  Loader2,
  User,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const {
    user,
    login,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * Si l'utilisateur est déjà connecté,
   * on l'envoie directement vers le dashboard.
   */
  if (!authLoading && user) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  /*
   * Connexion
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!username.trim()) {
      toast.error(
        "Veuillez saisir votre identifiant."
      );
      return;
    }

    if (!password) {
      toast.error(
        "Veuillez saisir votre mot de passe."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Si les identifiants sont faux,
       * login() doit lancer une erreur.
       */
      await login(
        username.trim(),
        password
      );

      /*
       * Ce message ne s'affiche QUE si login()
       * s'est terminé avec succès.
       */
      toast.success(
        "Connexion réussie."
      );

      const from =
        (
          location.state as {
            from?: {
              pathname?: string;
            };
          }
        )?.from?.pathname ||
        "/admin/dashboard";

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Erreur connexion:",
        error
      );

      /*
       * Récupération du message envoyé
       * par le AuthContext.
       */
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Identifiant ou mot de passe incorrect."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * Pendant la vérification du token
   */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2
          size={32}
          className="animate-spin text-[#2464cc]"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-950">
      <div className="w-full max-w-md">

        {/* CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">

          {/* HEADER */}
          <div className="mb-8 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2464cc]/10 text-[#2464cc]">
              <Lock size={24} />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-gray-900 dark:text-white">
              Administration
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Connectez-vous pour accéder à votre dashboard.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* IDENTIFIANT */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Identifiant
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  autoComplete="username"
                  placeholder="Identifiant"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#2464cc] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

              </div>

            </div>

            {/* MOT DE PASSE */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  placeholder="Mot de passe"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#2464cc] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

              </div>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2464cc] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d55b0] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <LogIn size={18} />
              )}

              {loading
                ? "Connexion..."
                : "Se connecter"}

            </button>

          </form>
        </div>

        {/* FOOTER */}
        <p className="mt-5 text-center text-xs text-gray-400">
          Espace d'administration sécurisé
        </p>

      </div>
    </div>
  );
};

export default Login;