import React, { useState } from "react";
import axios from "axios";
import { getToken } from "@/lib/auth";

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

interface ExamenCardProps {
  examen: Examen;
}

export const ExamenCard: React.FC<ExamenCardProps> = ({ examen }) => {
  const [respuestas, setRespuestas] = useState<{ [preguntaId: number]: string }>(
    () =>
      examen.preguntas.reduce((acc, p) => {
        acc[p.id] = p.respuestaUsuario || "";
        return acc;
      }, {} as { [preguntaId: number]: string })
  );
  const [corrigiendo, setCorrigiendo] = useState(false);
  const [resultado, setResultado] = useState<number | null>(null);
  const [preguntasCorregidas, setPreguntasCorregidas] = useState<PreguntaExamen[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completado, setCompletado] = useState(examen.completado);

  const handleSeleccionRespuesta = (preguntaId: number, opcion: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: opcion,
    }));
  };

  const handleCorregir = async () => {
    setCorrigiendo(true);
    setError(null);

    let correctas = 0;
    const corregidas = examen.preguntas.map((p) => {
      const respuestaUsuario = respuestas[p.id] || null;
      const esCorrecta = respuestaUsuario === p.pregunta.respuestaCorrecta;
      if (esCorrecta) correctas++;
      return {
        ...p,
        respuestaUsuario,
        esCorrecta,
      };
    });

    setPreguntasCorregidas(corregidas);
    setResultado(correctas);
    setCompletado(true);

    // Enviar resultado al backend
    try {
      await axios.post(
        `http://localhost:8080/examenes/corregir/${examen.id}`,
        {
          respuestasCorrectas: correctas,
          completado: true,
          preguntas: corregidas.map((p) => ({
            id: p.id,
            respuestaUsuario: p.respuestaUsuario,
            esCorrecta: p.esCorrecta,
          })),
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
    } catch (err) {
      setError("No se pudo guardar el resultado del examen.");
    }
    setCorrigiendo(false);
  };

  // Mostrar preguntas corregidas si ya se corrigió, si no las originales
  const preguntasAMostrar = preguntasCorregidas || examen.preguntas;

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 w-full max-w-2xl mx-auto text-white">
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-xl font-bold mb-1">Examen #{examen.id}</h2>
          <p className="text-gray-300 text-sm">
            Tema: <span className="font-semibold">{examen.tema}</span>
          </p>
          <p className="text-gray-300 text-sm">
            Fecha: {new Date(examen.fechaCreacion).toLocaleString()}
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <p className="text-gray-300 text-sm">
            Alumno: <span className="font-semibold">{examen.usuario.nombre}</span>
          </p>
          <p className="text-gray-300 text-sm">
            Email: <span className="font-semibold">{examen.usuario.email}</span>
          </p>
        </div>
      </div>
      <div className="mb-4 flex gap-6">
        <span>
          <span className="font-bold">Correctas:</span>{" "}
          {resultado !== null ? resultado : examen.respuestasCorrectas}
        </span>
        <span>
          <span className="font-bold">Completado:</span>{" "}
          {completado ? (
            <span className="text-green-400 font-bold">Sí</span>
          ) : (
            <span className="text-red-400 font-bold">No</span>
          )}
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Preguntas:</h3>
        <ol className="space-y-4">
          {preguntasAMostrar.map((preguntaExamen, idx) => (
            <li key={preguntaExamen.id} className="bg-gray-800 rounded p-4">
              <div className="font-semibold mb-2">
                {idx + 1}. {preguntaExamen.pregunta.pregunta}
              </div>
              <div className="flex flex-col gap-1 mb-2">
                {Object.entries(preguntaExamen.pregunta.opciones).map(([letra, texto]) => (
                  <label key={letra} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`pregunta-${preguntaExamen.id}`}
                      value={letra}
                      disabled={completado || resultado !== null}
                      checked={respuestas[preguntaExamen.id] === letra}
                      onChange={() => handleSeleccionRespuesta(preguntaExamen.id, letra)}
                      className="accent-teal-400"
                    />
                    <span>{letra}. {texto}</span>
                    {letra === preguntaExamen.pregunta.respuestaCorrecta && (
                      <span className="ml-2 text-teal-400 font-bold">(Correcta)</span>
                    )}
                  </label>
                ))}
              </div>
              <div className="mt-2">
                <span className="font-bold">Respuesta usuario:</span>{" "}
                {preguntaExamen.respuestaUsuario
                  ? (
                    <span>
                      {preguntaExamen.respuestaUsuario}
                      {preguntaExamen.esCorrecta === true && (
                        <span className="ml-2 text-green-400 font-bold">¡Correcta!</span>
                      )}
                      {preguntaExamen.esCorrecta === false && (
                        <span className="ml-2 text-red-400 font-bold">Incorrecta</span>
                      )}
                    </span>
                  )
                  : <span className="text-gray-400">Sin responder</span>
                }
              </div>
            </li>
          ))}
        </ol>
      </div>
      {!completado && (
        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-700"
            onClick={handleCorregir}
            disabled={corrigiendo}
          >
            {corrigiendo ? "Corrigiendo..." : "Corregir Examen"}
          </button>
        </div>
      )}
      {error && <div className="text-red-400 mt-4">{error}</div>}
    </div>
  );
};

export default ExamenCard;