"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { useUser } from "@/context/userContext";
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { usuario, setUsuario } = useUser(); // Usamos el contexto de usuario

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login con email:", email, "y contraseña:", password, "desde form")
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=604800`;

        //Obtenenos el usuario
        const userResponse = await fetch("http://localhost:8080/usuarios/getUsuarioByEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({ email }),
        });
        
        const userData = await userResponse.json();
        console.log("Usuario obtenido:", userData);
        if (userResponse.ok) {
          setUsuario(userData); // Guardamos el usuario en el contexto
          console.log("Usuario guardado en el contexto:", usuario);
        } else {
          setError("No se pudo obtener el usuario");
          setLoading(false);
          return;
        }

        router.push("/");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  const handleLinkedinLogin = () => {
    window.location.href = "http://localhost:8080/auth/linkedin";
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm 
          email={email}
          password={password}
          loading={loading}
          error={error}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleLogin}
        />
      </div>
    </div>

  );
}