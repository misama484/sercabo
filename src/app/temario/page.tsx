"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const temas = [
  { id: 1, nombre: "Tema 1 - RROO" },
  { id: 2, nombre: "Tema 2 - Ley 8/2006" },
  { id: 3, nombre: "Tema 3 - Orden ministerial 3/2011" },
  // Añade más temas según tu API
];

const TemarioPage: React.FC = () => {
  const [temaSeleccionado, setTemaSeleccionado] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const bloquearContextMenu = (e: MouseEvent) => e.preventDefault();
    const bloquearShortcuts = (e: KeyboardEvent) => {
      // Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+Shift+I, F12
      if (
        (e.ctrlKey && ["s", "p", "u"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("contextmenu", bloquearContextMenu);
    document.addEventListener("keydown", bloquearShortcuts);
    return () => {
      document.removeEventListener("contextmenu", bloquearContextMenu);
      document.removeEventListener("keydown", bloquearShortcuts);
    };
  }, []);

    const handleVolverHome = () => {
    router.push("/");
  };

    const handleSelectTema = (temaId: number) => {
    setTemaSeleccionado(temaId);
  };

  const idpdf = 1; // Cambia esto según el tema seleccionado

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Menú lateral izquierdo */}
      <div className="w-64 bg-gray-700 shadow-lg p-4 flex flex-col justify-between min-h-screen">
        <div>
          <h2 className="text-xl text-white font-bold mb-4">Opciones</h2>
          <h3 className="text-lg font-semibold text-white mb-2">Temas</h3>
          <ul className="flex flex-col gap-2 mb-6">
            {temas.map((tema) => (
              <li key={tema.id} className="w-full flex">
                <button
                  onClick={() => handleSelectTema(tema.id)}
                  className={`w-full px-2 py-2 text-center rounded ${
                    temaSeleccionado === tema.id
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white rounded hover:bg-blue-500"
                  }`}
                >
                  {tema.nombre}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleVolverHome}
            className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Inicio
          </button>
        </div>
        {/* Mostrar la imagen en la parte inferior si hay un tema seleccionado */}
        {temaSeleccionado && (
          <div className="mt-6">
            <Image
              src="/img/soldado.png"
              alt="soldado"
              width={128}
              height={128}
              className="mx-auto"
            />
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6">Temario PDF</h1>
        <div className="flex gap-4 mb-8 flex-wrap">
          {temas.map((tema) => (
            <button
              key={tema.id}
              onClick={() => setTemaSeleccionado(tema.id)}
              className={`px-4 py-2 rounded ${
                temaSeleccionado === tema.id
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {tema.nombre}
            </button>
          ))}
        </div>
        {temaSeleccionado && (
          <div className="flex flex-col items-center w-full">
            <h2 className="text-xl font-semibold mb-4">
              Visualizando: {temas.find((t) => t.id === temaSeleccionado)?.nombre}
            </h2>
            <div className="w-full max-w-4xl h-[80vh] border-2 border-primary rounded overflow-hidden shadow-lg">
              <iframe
                src={`http://localhost:8080/temario/${temaSeleccionado}`}
                title="PDF Temario"
                width="100%"
                height="100%"
                className="w-full h-full"
                allowFullScreen={false}
                style={{
                  pointerEvents: "auto",
                  userSelect: "none",
                }}
              />
            </div>
            <p className="mt-4 text-sm text-gray-400">
              La descarga y copia del documento está restringida.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemarioPage;