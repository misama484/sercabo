"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '@/lib/auth'; 
import { useUser } from '@/context/userContext';
import ExamenCard from '@/components/examenCard';


interface Opcion {
  [key: string]: string;
}

interface Pregunta {
  id: string;
  pregunta: string;
  respuestaCorrecta: string;
  opciones: Opcion;
  tema: number;
}

interface PreguntaExamen {
  id: number;
  pregunta: Pregunta;
  respuestaUsuario: string | null;
  esCorrecta: boolean | null;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  avatarCode: number;
}

interface Examen {
  id: number;
  usuario: Usuario;
  tema: number;
  fechaCreacion: string;
  respuestasCorrectas: number;
  completado: boolean;
  preguntas: PreguntaExamen[];
}

const temas = [
  { id: 1, nombre: "Tema 1 - RROO" },
  { id: 2, nombre: "Tema 2 - Ley 8/2006" },
  { id: 3, nombre: "Tema 3 - Orden ministerial 3/2011" },
  { id: 4, nombre: "Tema 4 - Carrera Militar" },
  { id: 5, nombre: "Tema 5 - Regimen disciplinario" },
  { id: 6, nombre: "Tema 6 - Seguridad en las FAS" },
  // Añade más temas si es necesario
];

const cantidades = [5, 10, 20, 30, 50];

const ExamenesPage: React.FC = () => {
  const { usuario } = useUser();
  const [temaSeleccionado, setTemaSeleccionado] = useState<number | null>(null);
  const [cantidadPreguntas, setCantidadPreguntas] = useState<number>(5);
  const [examen, setExamen] = useState<Examen | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listaExamenes, setListaExamenes] = useState<Examen[]>([]);
  const [examenSeleccionado, setExamenSeleccionado] = useState<Examen | null>(null);

  // Recuperar exámenes al cargar la página si hay usuario
  useEffect(() => {
    if (usuario) {
      recuperarExamen(usuario.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const handleSeleccionarTema = (temaId: number) => {
    setTemaSeleccionado(temaId);
    console.log("Tema seleccionado:", temaId);
  };

  const handleCantidadPreguntas = (cantidad: number) => {
    setCantidadPreguntas(cantidad);
    console.log("Cantidad de preguntas seleccionada:", cantidad);
  };

  const handleGenerarExamen = async () => {
    if (!temaSeleccionado || !cantidadPreguntas) {
      setError("Por favor, selecciona un tema y una cantidad de preguntas.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/examenes/generar?usuarioId=${usuario?.id}&tema=${temaSeleccionado}&cantidad=${cantidadPreguntas}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log("Examen generado:", res.data);
      setExamen(res.data);
      setError(null);
    } catch (err) {
      setError("Error al generar el examen." + err);
    }
  };

  //RECUPERAR EXAMEN DESDE BBDD
  const recuperarExamen = async (usuarioId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/examenes/all?usuarioId=${usuarioId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setListaExamenes(res.data);
      setExamen(null);
      setExamenSeleccionado(null);
      setError(null);
    } catch (err) {
      setError("No se pudo recuperar el listado de exámenes.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Exámenes</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => handleSeleccionarTema(1)}
      >
        Seleccionar Tema 1
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => handleCantidadPreguntas(5)}
      >
        Seleccionar 5 Preguntas
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-800"
        onClick={handleGenerarExamen}
      >
        Generar Examen
      </button>
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => usuario && recuperarExamen(usuario.id)}
      >
        Recuperar Exámenes
      </button>

      {listaExamenes.length > 0 && (
        <div className="mt-8 w-full overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-white">Tus exámenes</h2>
          <table className="min-w-full bg-gray-800 rounded text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tema</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Correctas</th>
                <th className="px-4 py-2">Completado</th>
                <th className="px-4 py-2">Ver</th>
              </tr>
            </thead>
            <tbody>
              {listaExamenes.map((ex) => (
                <tr
                  key={ex.id}
                  className="text-center border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                >
                  <td className="px-4 py-2">{ex.id}</td>
                  <td className="px-4 py-2">{ex.tema}</td>
                  <td className="px-4 py-2">{new Date(ex.fechaCreacion).toLocaleString()}</td>
                  <td className="px-4 py-2">{ex.respuestasCorrectas}</td>
                  <td className="px-4 py-2">
                    {ex.completado ? (
                      <span className="text-green-400 font-bold">Sí</span>
                    ) : (
                      <span className="text-red-400 font-bold">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-teal-400 text-black px-3 py-1 rounded hover:bg-teal-600"
                      onClick={() => setExamenSeleccionado(ex)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mostrar ExamenCard debajo de la tabla si hay examen seleccionado */}
      {examenSeleccionado && (
        <div className="mt-8 w-full flex justify-center">
          <ExamenCard examen={examenSeleccionado} />
        </div>
      )}
    </div>
  );
};

export default ExamenesPage;