"use client";
import React, { useState } from "react";
import TestQuestionCard from "@/components/testQuestionCard";
import preguntasGenerales from "@/data/preguntas.json";
import preguntasTema1 from "@/data/preguntasTema1RROO.json";

// Función para obtener preguntas aleatorias
const obtenerPreguntasAleatorias = (preguntas: any[], cantidad: number) => {
  const preguntasMezcladas = [...preguntas].sort(() => Math.random() - 0.5);
  return preguntasMezcladas.slice(0, cantidad);
};

const TestPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [preguntas, setPreguntas] = useState<any[]>([]); // Inicialmente vacío
  const [cantidadPreguntas, setCantidadPreguntas] = useState(10); // Cantidad de preguntas por defecto
  const [temaSeleccionado, setTemaSeleccionado] = useState<string | null>(null); // Tema seleccionado

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

  const handleSelectTema = (tema: string, cantidad: number) => {
    // Cargar preguntas aleatorias según el tema seleccionado
    const preguntasSeleccionadas =
      tema === "generales"
        ? obtenerPreguntasAleatorias(preguntasGenerales, cantidad)
        : obtenerPreguntasAleatorias(preguntasTema1, cantidad);

    setPreguntas(preguntasSeleccionadas);
    setTemaSeleccionado(tema);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
  };

  const handleSelectCantidad = (cantidad: number) => {
    setCantidadPreguntas(cantidad);
    // Si ya hay un tema seleccionado, recargar las preguntas con la nueva cantidad
    if (temaSeleccionado) {
      handleSelectTema(temaSeleccionado, cantidad);
    }
  };

    const handleVolverSeleccionTema = () => {
    setTemaSeleccionado(null); // Restablecer el estado para volver a la pantalla de selección de temas
    setPreguntas([]); // Limpiar las preguntas
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
  };

  const currentQuestion = preguntas[currentQuestionIndex];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        {!temaSeleccionado ? (
          // Mostrar mensaje y botones para seleccionar tema
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-black">
              Selecciona Tema
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => handleSelectTema("generales", cantidadPreguntas)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Preguntas Generales
              </button>
              <button
                onClick={() => handleSelectTema("tema1", cantidadPreguntas)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Tema 1 - RROO
              </button>
            </div>
          </div>
        ) : (
          // Mostrar TestQuestionCard con las preguntas
          <>
            <h1 className="text-2xl font-bold mb-4 text-black">
              Pregunta {currentQuestionIndex + 1} de {preguntas.length}
            </h1>
            <h2 className="text-lg mb-4 text-black">
              Respuestas correctas: {correctAnswers} / {preguntas.length}
            </h2>
            <TestQuestionCard
              pregunta={currentQuestion.pregunta}
              opciones={currentQuestion.opciones}
              respuesta_correcta={currentQuestion.respuesta_correcta}
              onAnswer={handleAnswer}
              resetStateOnChange={currentQuestionIndex} // Prop para reiniciar estados
            />
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePreviousQuestion}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                disabled={currentQuestionIndex === 0}
              >
                Anterior
              </button>
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                disabled={currentQuestionIndex === preguntas.length - 1}
              >
                Siguiente
              </button>
            </div>
            <button
              onClick={handleVolverSeleccionTema}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            >
              Volver a Selección de Tema
            </button>
          </>
        )}
      </div>

      {/* Menú lateral derecho */}
      <div className="w-1/4 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Opciones</h2>
        <h3 className="text-lg font-semibold mb-2">Cantidad de Preguntas</h3>
        <ul className="space-y-2">
          {[10, 20, 30, 50].map((cantidad) => (
            <li key={cantidad}>
              <button
                onClick={() => handleSelectCantidad(cantidad)}
                className={`w-full px-4 py-2 rounded ${
                  cantidadPreguntas === cantidad
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {cantidad} Preguntas
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestPage;