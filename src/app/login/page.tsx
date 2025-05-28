"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { useUser } from "@/context/userContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { usuario, setUsuario } = useUser(); // Usamos el contexto de usuario

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="flex flex-col min-h-screen bg-background text-white items-center justify-between p-0">
      {/* Logo en la parte superior */}
      <div className="w-full flex flex-col items-center mt-12">
        <Image
          src="/img/sercabologo.png"
          alt="Logo SerCabo"
          width={180}
          height={180}
          className="mb-4"
        />
        <h1 className="text-3xl font-bold mt-2">Iniciar Sesión</h1>
      </div>
      {/* Formulario en la parte inferior */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md mx-auto flex flex-col items-center gap-6 mb-16"
      >
        <div className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div className="w-full text-center text-red-400 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-teal-400 text-black font-bold rounded hover:bg-teal-700 transition-colors"
        >
          {loading ? "Accediendo..." : "Entrar"}
        </button>
        <div className="flex items-center w-full gap-4 mt-2">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">o</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>
        <div className="flex w-full gap-4 justify-center">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            <FaGoogle className="text-xl" />
            Google
          </button>
          <button
            type="button"
            onClick={handleLinkedinLogin}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
          >
            <FaLinkedin className="text-xl" />
            LinkedIn
          </button>
        </div>
      </form>
    </div>
  );
}