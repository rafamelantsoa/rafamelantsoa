import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type LoadingContextType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext =
  createContext<LoadingContextType | null>(null);

type LoadingProviderProps = {
  children: ReactNode;
};

export const LoadingProvider = ({
  children,
}: LoadingProviderProps) => {
  const [loading, setLoading] =
    useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
        startLoading,
        stopLoading,
      }}
    >
      {children}

      {loading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context =
    useContext(LoadingContext);

  if (!context) {
    throw new Error(
      "useLoading must be used inside LoadingProvider"
    );
  }

  return context;
};