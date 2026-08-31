import {
    createContext,
    useContext,
    useState,
    type ReactNode,
  } from "react";
  
  
  /* =========================================================
     TYPES
  ========================================================= */
  
  interface LoadingContextType {
    loading: boolean;
    setLoading: (value: boolean) => void;
  }
  
  
  /* =========================================================
     CONTEXT
  ========================================================= */
  
  const LoadingContext =
    createContext<LoadingContextType | undefined>(
      undefined
    );
  
  
  /* =========================================================
     PROVIDER
  ========================================================= */
  
  interface LoadingProviderProps {
    children: ReactNode;
  }
  
  
  export const LoadingProvider = ({
    children,
  }: LoadingProviderProps) => {
  
    const [loading, setLoading] =
      useState(true);
  
  
    return (
      <LoadingContext.Provider
        value={{
          loading,
          setLoading,
        }}
      >
        {children}
      </LoadingContext.Provider>
    );
  };
  
  
  /* =========================================================
     HOOK
  ========================================================= */
  
  export const useLoading = () => {
  
    const context =
      useContext(LoadingContext);
  
    if (!context) {
  
      throw new Error(
        "useLoading doit être utilisé à l'intérieur de LoadingProvider."
      );
  
    }
  
    return context;
  };