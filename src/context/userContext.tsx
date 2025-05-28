"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  avatarCode: number;
}

interface UserContextProps {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);

  // Al iniciar, intenta cargar el usuario de localStorage
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      setUsuarioState(JSON.parse(stored));
    }
  }, []);

  // Cada vez que cambie el usuario, guárdalo en localStorage
  const setUsuario = (user: Usuario | null) => {
    setUsuarioState(user);
    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
    } else {
      localStorage.removeItem("usuario");
    }
  };

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};