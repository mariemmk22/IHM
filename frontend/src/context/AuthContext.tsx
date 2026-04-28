import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "client" | "prestataire" | "provider" | "admin" | null;

export interface AuthUser {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  role: UserRole;
  specialite?: string;
  region?: string;
  telephone?: string;
  description?: string;
  disponibilites?: string[];
  prestataireId?: string | null;
  statutCompte?: "actif" | "bloque" | "inactif" | "en_attente";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (userData: AuthUser, token: string) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  updateUser: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem("servidom_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("servidom_token");
    } catch {
      return null;
    }
  });

  const login = (userData: AuthUser, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    sessionStorage.setItem("servidom_user", JSON.stringify(userData));
    sessionStorage.setItem("servidom_token", authToken);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const updatedUser = { ...currentUser, ...updates };
      sessionStorage.setItem("servidom_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("servidom_user");
    sessionStorage.removeItem("servidom_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, updateUser, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
