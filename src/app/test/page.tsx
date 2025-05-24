"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import TestQuestionCard from "@/components/testQuestionCard";

// Lista de temas (solo para mostrar los botones)
const temas = [
  { id: 1, nombre: "Tema 1 - RROO" },
  { id: 2, nombre: "Tema 2 - Ley 8/2006" },
  { id: 3, nombre: "Tema 3 - Orden ministerial 3/2011" },
  { id: 4, nombre: "Tema 4 - Carrera Militar" },
  { id: 5, nombre: "Tema 5 - Regimen disciplinario" },
  { id: 6, nombre: "Tema 6 - Seguridad en las FAS" },
  { id: 7, nombre: "Tema 7 - " },
  { id: 8, nombre: "Tema 8 - " },
  { id: 9, nombre: "Tema 9 - " },
  { id: 10, nombre: "Tema 10 - " },
  // Añade más temas según tu API
];

const TestPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [cantidadPreguntas, setCantidadPreguntas] = useState(10);
  const [temaSeleccionado, setTemaSeleccionado] = useState<number | null>(null);

  const router = useRouter();

  // Cargar preguntas de la API cuando se selecciona tema o cantidad
  useEffect(() => {
    if (temaSeleccionado) {
      const fetchPreguntas = async () => {
        try {
          const preguntasRes = await axios.get(
            `http://localhost:8080/getAllPreguntasTemaLimit?tema=${temaSeleccionado}&limit=${cantidadPreguntas}`
          );
          // Adaptar los datos al formato esperado por TestQuestionCard
          const preguntasAdaptadas = preguntasRes.data.map((p: any) => ({
            pregunta: p.pregunta,
            opciones: p.opciones,
            respuesta_correcta: p.respuestaCorrecta,
            id: p.id,
            tema: p.tema,
          }));
          setPreguntas(preguntasAdaptadas);
          setCurrentQuestionIndex(0);
          setCorrectAnswers(0);
          setError(null);
        } catch (error: any) {
          setPreguntas([]);
          setCurrentQuestionIndex(0);
          setCorrectAnswers(0);
          setError('Error al cargar las preguntas. Por favor, inténtalo de nuevo.');
        }
      };
      fetchPreguntas();
      console.log("Preguntas cargadas:", preguntas);
    }
  }, [temaSeleccionado, cantidadPreguntas]);

  const handleVolverHome = () => {
    router.push("/");
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < preguntas.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleSelectTema = (temaId: number) => {
    setTemaSeleccionado(temaId);
    // El efecto useEffect se encargará de cargar las preguntas
  };

  const handleSelectCantidad = (cantidad: number) => {
    setCantidadPreguntas(cantidad);
    // El efecto useEffect se encargará de recargar las preguntas si hay tema seleccionado
  };

  const handleVolverSeleccionTema = () => {
    setTemaSeleccionado(null);
    setPreguntas([]);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setError(null);
  };

  const currentQuestion = preguntas[currentQuestionIndex];

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        {!temaSeleccionado ? (
          // Selección de tema y cantidad
          <div className="text-center ">
            <Image
              src="/img/soldado.png"
              alt="soldado"
              width={256}
              height={256}
              className="w-64 h-auto mx-auto mb-6 filter"
            />
            <h1 className="text-2xl font-bold mb-4 text-white">Selecciona Tema</h1>
            <h2 className="text-lg mb-4 text-white">Elige un tema para comenzar el test</h2>            
          </div>
        ) : preguntas.length > 0 ? (
          // Mostrar TestQuestionCard con las preguntas
          <>
            <Image
              src="/img/sercabologo.png"
              alt="soldado"
              width={256}
              height={256}
              className="w-64 h-auto mx-auto mb-6 filter"
            />
            <h1 className="text-2xl font-bold mb-4 text-white">
              Tema Seleccionado: {temaSeleccionado}
            </h1>
            <h1 className="text-2xl font-bold mb-4 text-white">
              Pregunta {currentQuestionIndex + 1} de {preguntas.length}
            </h1>
            <h2 className="text-lg mb-4 text-white">
              Respuestas correctas: {correctAnswers} / {preguntas.length}
            </h2>
            <TestQuestionCard
              pregunta={currentQuestion.pregunta}
              opciones={currentQuestion.opciones}
              respuesta_correcta={currentQuestion.respuesta_correcta}
              onAnswer={handleAnswer}
              resetStateOnChange={currentQuestionIndex}
            />
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePreviousQuestion}
                className="px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-700"
                disabled={currentQuestionIndex === 0}
              >
                Anterior
              </button>
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-700"
                disabled={currentQuestionIndex === preguntas.length - 1}
              >
                Siguiente
              </button>
            </div>
            <button
              onClick={handleVolverSeleccionTema}
              className="mt-6 px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-700"
            >
              Volver a Selección de Tema
            </button>
          </>
        ) : (
          <div className="text-center mt-10">
            <p className="text-red-400">{error || "Cargando preguntas..."}</p>
            <button
              onClick={handleVolverSeleccionTema}
              className="mt-6 px-4 py-2 bg-red-600 text-black rounded hover:bg-red-500"
            >
              Volver a Selección de Tema
            </button>
          </div>
        )}
      </div>

      {/* Menú lateral derecho */}
      <div className="w-1/8 bg-teal-900 shadow-lg p-4 flex flex-col justify-between">
        <div className="pt-8 border-2 border-red-500">          
          <h3 className="text-lg font-semibold text-white mb-2">Cantidad de Preguntas</h3>
          <ul className="space-y-2 mb-6">
            {[10, 20, 30, 50].map((cantidad) => (
              <li key={cantidad}>
                <button
                  onClick={() => handleSelectCantidad(cantidad)}
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
          <ul className="flex flex-wrap gap-2">
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
            onClick={handleVolverHome}
            className="mt-6 w-full px-4 py-2 bg-teal-400 text-black text-bold text-xl rounded hover:bg-teal-700"
          >Inicio</button>
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
    </div>
  );
};

export default TestPage;