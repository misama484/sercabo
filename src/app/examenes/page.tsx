"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/lib/auth";
import { useUser } from "@/context/userContext";

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
  const [respuestas, setRespuestas] = useState<{ [preguntaId: number]: string }>({});
  const [corrigiendo, setCorrigiendo] = useState(false);
  const [resultado, setResultado] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const token = getToken();

  const handleSeleccionarTema = (temaId: number) => {
    setTemaSeleccionado(temaId);
    console.log(temaId)
    setExamen(null);
    setRespuestas({});
    setResultado(null);
    setError(null);
    setGuardado(false);
  };

  const handleSeleccionCantidad = (cantidad: number) => {
    setCantidadPreguntas(cantidad);
    setExamen(null);
    setRespuestas({});
    setResultado(null);
    setError(null);
    setGuardado(false);
  };

  const handleGenerarExamen = async () => {
    if (!usuario || !temaSeleccionado) return;
    setExamen(null);
    setRespuestas({});
    setResultado(null);
    setError(null);
    setGuardado(false);
    try {
      console.log(usuario.id, temaSeleccionado, cantidadPreguntas); 
      const res = await axios.get(
        `http://localhost:8080/examenes/generar?usuarioId=${usuario.id}&tema=${temaSeleccionado}&cantidad=${cantidadPreguntas}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("Examen generado:", res.data);
      setExamen(res.data);
    } catch (err) {
      setError("No se pudo generar el examen.");
    }
  };

  const handleSeleccionRespuesta = (preguntaId: number, opcion: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: opcion,
    }));
  };

  const handleCorregir = async () => {
    if (!examen) return;
    setCorrigiendo(true);

    let correctas = 0;
    const preguntasCorregidas = examen.preguntas.map((p) => {
      const respuestaUsuario = respuestas[p.id] || null;
      const esCorrecta = respuestaUsuario === p.pregunta.respuestaCorrecta;
      if (esCorrecta) correctas++;
      return {
        ...p,
        respuestaUsuario,
        esCorrecta,
      };
    });

    setExamen({
      ...examen,
      preguntas: preguntasCorregidas,
      respuestasCorrectas: correctas,
      completado: true,
    });
    setResultado(correctas);

    // Enviar resultado al backend
    try {
      await axios.post(
        `http://localhost:8080/examenes/corregir/${examen.id}`,
        {
          respuestasCorrectas: correctas,
          completado: true,
          preguntas: preguntasCorregidas.map((p) => ({
            id: p.id,
            respuestaUsuario: p.respuestaUsuario,
            esCorrecta: p.esCorrecta,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      setError("No se pudo guardar el resultado del examen.");
    }
    setCorrigiendo(false);
  };

  const handleGuardarExamen = async () => {
    if (!examen) return;
    setGuardando(true);
    setError(null);
    try {
      // Aquí deberás implementar el endpoint en el backend para guardar el examen
      // Por ejemplo:
      // await axios.post("http://localhost:8080/examenes/guardar", examen, { headers: { Authorization: `Bearer ${token}` } });
      setGuardado(true);
    } catch (err) {
      setError("No se pudo guardar el examen en la base de datos.");
    }
    setGuardando(false);
  };

  //RECUPERAR EXAMEN DESDE BBDD
  const recuperarExamen = async (usuarioId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/examenes/all?${usuarioId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExamen(res.data);
    } catch (err) {
      setError("No se pudo recuperar el examen.");
    }
  };

// Genera examen al pulsar el tema o cantidad si ya hay un usuario y tema seleccionado
  useEffect(() => {
    if(usuario && temaSeleccionado && cantidadPreguntas) {
      handleGenerarExamen();
    }
  }, [usuario, temaSeleccionado, cantidadPreguntas]);



  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Generar Examen</h1>
      {!temaSeleccionado ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl mb-2">Selecciona un tema y la cantidad de preguntas:</h2>
          <div className="flex gap-4 mb-4">
            {cantidades.map((cantidad) => (
              <button
                key={cantidad}
                className={`px-4 py-2 rounded font-semibold ${
                  cantidadPreguntas === cantidad
                    ? "bg-teal-700 text-black"
                    : "bg-teal-400 text-black hover:bg-teal-700"
                }`}
                onClick={() => handleSeleccionCantidad(cantidad)}
              >
                {cantidad} preguntas
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {temas.map((tema) => (
              <button
                key={tema.id}
                className={`px-6 py-3 rounded font-semibold ${
                  temaSeleccionado === tema.id
                    ? "bg-teal-700 text-black"
                    : "bg-teal-400 text-black hover:bg-teal-700"
                }`}
                onClick={() => handleSeleccionarTema(tema.id)}
              >
                {tema.nombre}
              </button>
            ))}
          </div>
          <button
            className="mt-6 px-6 py-3 bg-teal-400 text-black font-bold rounded hover:bg-teal-700"
            onClick={handleGenerarExamen}
            disabled={!temaSeleccionado || !cantidadPreguntas || !usuario}
          >
            Generar Examen
          </button>
          <button
            className="mt-6 px-6 py-3 bg-teal-400 text-black font-bold rounded hover:bg-teal-700"
            
            disabled={!temaSeleccionado || !cantidadPreguntas || !usuario}
          >
            Recuperar Examenes
          </button>
          {error && <div className="text-red-400 mt-4">{error}</div>}
        </div>
      ) : examen ? (
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Examen Tema {examen.tema}</h2>
            <p className="text-gray-300 mb-2">
              Fecha: {new Date(examen.fechaCreacion).toLocaleString()}
            </p>
            <p className="text-gray-300 mb-2">
              Alumno: {examen.usuario.nombre} ({examen.usuario.email})
            </p>
            <p className="text-gray-300 mb-2">
              Preguntas: {examen.preguntas.length}
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCorregir();
            }}
          >
            {examen.preguntas.map((preguntaExamen, idx) => (
              <div key={preguntaExamen.id} className="mb-6 p-4 rounded bg-gray-800">
                <div className="mb-2 font-semibold">
                  {idx + 1}. {preguntaExamen.pregunta.pregunta}
                </div>
                <div className="flex flex-col gap-2">
                  {Object.entries(preguntaExamen.pregunta.opciones).map(([letra, texto]) => (
                    <label key={letra} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`pregunta-${preguntaExamen.id}`}
                        value={letra}
                        disabled={!!preguntaExamen.esCorrecta || resultado !== null}
                        checked={respuestas[preguntaExamen.id] === letra}
                        onChange={() => handleSeleccionRespuesta(preguntaExamen.id, letra)}
                        className="accent-teal-400"
                      />
                      <span>{letra}. {texto}</span>
                    </label>
                  ))}
                </div>
                {preguntaExamen.esCorrecta !== null && (
                  <div className={`mt-2 font-bold ${preguntaExamen.esCorrecta ? "text-green-400" : "text-red-400"}`}>
                    {preguntaExamen.esCorrecta
                      ? "¡Respuesta correcta!"
                      : `Incorrecto. Respuesta correcta: ${preguntaExamen.pregunta.respuestaCorrecta}`}
                  </div>
                )}
              </div>
            ))}
            {resultado === null && (
              <button
                type="submit"
                className="w-full px-4 py-3 bg-teal-400 text-black font-bold rounded hover:bg-teal-700 transition-colors mt-4"
                disabled={corrigiendo}
              >
                {corrigiendo ? "Corrigiendo..." : "Corregir Examen"}
              </button>
            )}
            {resultado !== null && (
              <div className="mt-6 text-xl font-bold text-center text-teal-400">
                Has acertado {resultado} de {examen.preguntas.length} preguntas.
              </div>
            )}
          </form>
          <div className="flex gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => {
                setTemaSeleccionado(null);
                setExamen(null);
                setRespuestas({});
                setResultado(null);
                setError(null);
                setGuardado(false);
              }}
            >
              Volver a selección de tema
            </button>
            <button
              className="px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-700"
              onClick={handleGuardarExamen}
              disabled={guardando || guardado}
            >
              {guardando ? "Guardando..." : guardado ? "Examen guardado" : "Guardar Examen"}
            </button>
          </div>
          {error && <div className="text-red-400 mt-4">{error}</div>}
        </div>
      ) : (
        <div className="text-center mt-10">Cargando examen...</div>
      )}
    </div>
  );
};

export default ExamenesPage;