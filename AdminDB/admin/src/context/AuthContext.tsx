import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import axios from "axios";

type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

  const API_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/auth`
    : "http://localhost:5000/api/auth";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * Vérification de la session au démarrage
   *
   * Le JWT est maintenant dans le cookie HttpOnly.
   * Il n'est donc plus récupéré depuis localStorage.
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/me`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.success) {
          setUser(response.data.admin);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Erreur vérification authentification:",
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * LOGIN
   */
  const login = async (
    username: string,
    password: string
  ): Promise<void> => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      /**
       * Le backend doit retourner success: true
       *
       * Le JWT n'est PAS récupéré ici.
       * Il est automatiquement placé dans le cookie
       * HttpOnly par le backend.
       */
      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Identifiant ou mot de passe incorrect."
        );
      }

      /**
       * Enregistrement de l'utilisateur
       */
      setUser(response.data.admin);
    } catch (error) {
      setUser(null);

      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Identifiant ou mot de passe incorrect."
        );
      }

      throw error;
    }
  };

  /**
   * LOGOUT
   */
  const logout = async (): Promise<void> => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error(
        "Erreur déconnexion:",
        error
      );
    } finally {
      /**
       * Le backend supprime le cookie.
       * On supprime également l'utilisateur
       * de l'état React.
       */
      setUser(null);
    }
  };

  /**
   * CONTEXT
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth
 */
export const useAuth = (): AuthContextType => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth doit être utilisé dans AuthProvider"
    );
  }

  return context;
};