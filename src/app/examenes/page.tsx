"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '@/lib/auth'; 
import { useUser } from '@/context/userContext';
import ExamenCard from '@/components/examenCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {AppSidebar} from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';


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
  { id: 4, nombre: "Tema 4 - Ley 39-2007 Carrera Militar" },
  { id: 5, nombre: "Tema 5 - Regimen disciplinario" },
  { id: 6, nombre: "Tema 6 - Seguridad en las FAS" },
  { id: 7, nombre: "Tema 7 - Codigo penal" },
  { id: 8, nombre: "Tema 8 - Organización de las FAS" },
  // Añade más temas según tu API
];

const EXAMENES_POR_PAGINA = 5; // Número de exámenes por página

const cantidades = [5, 10, 20, 30, 50];

const ExamenesPage: React.FC = () => {
  const { usuario } = useUser();
  const [temaSeleccionado, setTemaSeleccionado] = useState<number | null>(null);
  const [cantidadPreguntas, setCantidadPreguntas] = useState<number>(5);
  const [examen, setExamen] = useState<Examen | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listaExamenes, setListaExamenes] = useState<Examen[]>([]);
  const [examenSeleccionado, setExamenSeleccionado] = useState<Examen | null>(null);
  const [ paginaActual, setPaginaActual] = useState(1);

  const router = useRouter();

  // Recuperar exámenes al cargar la página si hay usuario
  useEffect(() => {
    if (usuario) {
      recuperarExamen(usuario.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

    // Si cambia la lista, vuelve a la página 1
  useEffect(() => {
    setPaginaActual(1);
  }, [listaExamenes]);

  // Calcular los exámenes a mostrar en la página actual
  const totalPaginas = Math.ceil(listaExamenes.length / EXAMENES_POR_PAGINA);
  const inicio = (paginaActual - 1) * EXAMENES_POR_PAGINA;
  const fin = inicio + EXAMENES_POR_PAGINA;
  const examenesPagina = listaExamenes.slice(inicio, fin);

  // Funciones para navegar
  const handleAnterior = () => setPaginaActual((p) => Math.max(1, p - 1));
  const handleSiguiente = () => setPaginaActual((p) => Math.min(totalPaginas, p + 1));


  const handleSeleccionarTema = (temaId: number) => {
    setTemaSeleccionado(temaId);
    console.log("Tema seleccionado:", temaId);
  };

  const handleCantidadPreguntas = (cantidad: number) => {
    setCantidadPreguntas(cantidad);
    console.log("Cantidad de preguntas seleccionada:", cantidad);
  };

  const handleSelectTema = (temaId: number) => {
    setTemaSeleccionado(temaId);
    console.log("Tema seleccionado:", temaId);
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

    const handleVolverHome = () => {
    router.push("/");
  };

  return (      
    <div className="flex min-h-screen bg-background text-white flex-row"> 
      <div className="w-64 flex-shrink-0">
        <SidebarProvider>
          <AppSidebar
            onCantidadPreguntas={handleCantidadPreguntas}
            cantidadPreguntasSeleccionada={cantidadPreguntas}
            onSeleccionarTema={handleSelectTema}
            onGenerarExamen={handleGenerarExamen}
            onRecuperarExamenes={() => usuario && recuperarExamen(usuario.id)}
            onInicio={handleVolverHome}
        />
        </SidebarProvider> 
      </div>   
       {/* Menú lateral izquierdo */}
       {/* <div className="w-64 bg-gray-700 shadow-lg p-4 flex flex-col justify-between min-h-screen">
              <div>
                <h1 className="text-2xl text-white font-bold mb-4">Examenes</h1>
                <h2 className="text-xl text-white font-bold mb-4">Preguntas examen</h2>
                <ul className="space-y-2 mb-6">
                  {[10, 20, 30, 50].map((cantidad) => (
                    <li key={cantidad}>
                      <button
                        onClick={() => handleCantidadPreguntas(cantidad)}
                        className={`w-full px-4 py-2 rounded ${
                          cantidadPreguntas === cantidad
                            ? "bg-teal-700 text-black"
                            : "bg-teal-400 text-black rounded hover:bg-teal-700"
                        }`}
                      >
                        {cantidad} Preguntas
                      </button>
                    </li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold text-white mb-2">Temas</h3>
                <ul className="flex flex-col gap-2 mb-6">
                  {temas.map((tema) => (
                    <li key={tema.id} className="w-full flex">
                      <button
                        onClick={() => handleSelectTema(tema.id)}
                        className={`w-full px-2 py-2 text-center rounded ${
                          temaSeleccionado === tema.id
                            ? "bg-teal-700 text-black"
                            : "bg-teal-400 text-black rounded hover:bg-teal-700"
                        }`}
                      >
                        {tema.nombre}
                      </button>
                    </li>
                  ))}
                </ul>                
                
                <button
                  className="mt-6 w-full px-4 py-2 bg-teal-400 text-black text-bold text-xl rounded hover:bg-teal-700"
                  onClick={handleGenerarExamen}
                >
                  Generar Examen
                </button>
                <button
                  className="mt-6 w-full px-4 py-2 bg-teal-400 text-black text-bold text-xl rounded hover:bg-teal-700"
                  onClick={() => usuario && recuperarExamen(usuario.id)}
                >
                  Recuperar Exámenes
                </button>
                <button
                  onClick={handleVolverHome}
                  className="mt-6 w-full px-4 py-2 bg-teal-400 text-black text-bold text-xl rounded hover:bg-teal-700"
                >
                  Inicio
                </button>
              </div>
              <div className="mt-6">
                <Image
                  src="/img/soldado.png"
                  alt="soldado"
                  width={128}
                  height={128}
                  className="mx-auto"
                />
              </div>
            </div>*/}

      
      

      {listaExamenes.length > 0 && (
        <div className="mt-8 mx-10 w-full overflow-x-auto">
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
              {examenesPagina.map((ex) => (
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

          {/* Controles de paginación */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
              onClick={handleAnterior}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
              onClick={handleSiguiente}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
          {/* Mostrar ExamenCard debajo de la tabla si hay examen seleccionado */}
            {examenSeleccionado && (
              <div className="mt-8 w-full flex justify-center">
                <ExamenCard examen={examenSeleccionado} />
              </div>
            )}
        </div>
      )}      
    </div>
    
  );
};

export default ExamenesPage;