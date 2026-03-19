import React, { createContext, useContext, useState, useCallback } from "react";

export type PersonaRole = "talent" | "founder" | "boi-officer" | "admin";

export interface User {
  name: string;
  role: PersonaRole;
  avatar: string;
}

const PERSONA_USERS: Record<PersonaRole, User> = {
  talent: { name: "Amina Bello", role: "talent", avatar: "AB" },
  founder: { name: "Chidi Okafor", role: "founder", avatar: "CO" },
  "boi-officer": { name: "Dr. Folake Ade", role: "boi-officer", avatar: "FA" },
  admin: { name: "Ibrahim Musa", role: "admin", avatar: "IM" },
};

interface AuthContextType {
  user: User | null;
  login: (role: PersonaRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const login = useCallback((role: PersonaRole) => {
    setUser(PERSONA_USERS[role]);
    setHasSeenOnboarding(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setHasSeenOnboarding(false);
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasSeenOnboarding(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasSeenOnboarding, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
