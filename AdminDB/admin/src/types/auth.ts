export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: string;
  email: string;
  role?: "admin" | "user";
}

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;

  login: (token: string) => void;
  logout: () => void;
}