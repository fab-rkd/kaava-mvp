"use client";
// ─── context/AuthModalContext.tsx ────────────────────────────────────────────
//
// Simple context to control the Account/Auth modal visibility.
// Any component can call openAuthModal() to show the login/signup modal.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type AuthModalContextType = {
  isOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsOpen(true), []);
  const closeAuthModal = useCallback(() => setIsOpen(false), []);

  return (
    <AuthModalContext.Provider value={{ isOpen, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextType {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used inside an <AuthModalProvider>");
  }
  return context;
}
