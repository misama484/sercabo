"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TestQuestionCard from "@/components/testQuestionCard";
import preguntasGenerales from "@/data/preguntas.json";
import preguntasTema1 from "@/data/preguntasTema1RROO.json";
import preguntasTema2 from "@/data/preguntasTema2Ley82006.json";
import preguntasTema3 from "@/data/preguntasTema3OrdenMinisterial32011.json";
import preguntasTema4 from "@/data/preguntasTema4CarreraMilitar.json";
import preguntasTema5 from "@/data/preguntasTema5RegimenDisciplinario.json";
import preguntasTema6 from "@/data/preguntasTema6SeguridadEnLasFas.json";
import preguntasTema7 from "@/data/preguntasTema7CodigoPenal.json";
import preguntasTema8 from "@/data/preguntasTema8OrganizacionFas.json";
import preguntasTema9 from "@/data/preguntasTema9EjercitoDeTierra.json";
import preguntasTema10 from "@/data/preguntasTema10DerechosYDeberes.json";
import preguntasTema11 from "@/data/preguntasTema11IniciativasYQuejas.json";

// Lista dinámica de temas
const temas = [
  { id: "generales", nombre: "Preguntas Generales", datos: preguntasGenerales },
  { id: "tema1", nombre: "Tema 1 - RROO", datos: preguntasTema1 },
  { id: "tema2", nombre: "Tema 2 - Ley 8/2006", datos: preguntasTema2 },
  { id: "tema3", nombre: "Tema 3 - Orden Ministerial 32011", datos: preguntasTema3 },
  { id: "tema4", nombre: "Tema 4 - Carrera Militar", datos: preguntasTema4 },
  { id: "tema5", nombre: "Tema 5 - Régimen Disciplinario", datos: preguntasTema5 },
  { id: "tema6", nombre: "Tema 6 - Seguridad en las FAS", datos: preguntasTema6 },
  { id: "tema7", nombre: "Tema 7 - Código Penal", datos: preguntasTema7 },
  { id: "tema8", nombre: "Tema 8 - Organización FAS", datos: preguntasTema8 },
  { id: "tema9", nombre: "Tema 9 - Ejército de Tierra", datos: preguntasTema9 },
  { id: "tema10", nombre: "Tema 10 - Derechos y Deberes", datos: preguntasTema10 },
  { id: "tema11", nombre: "Tema 11 - Iniciativas y Quejas", datos: preguntasTema11 },

];

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

  const router = useRouter();

  // Función para volver a la página de inicio
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

  const handleSelectTema = (temaId: string, cantidad: number) => {
    // Buscar el tema seleccionado en la lista de temas
    const tema = temas.find((t) => t.id === temaId);
    if (!tema) return;

    // Cargar preguntas aleatorias del tema seleccionado
    const preguntasSeleccionadas = obtenerPreguntasAleatorias(tema.datos, cantidad);

    setPreguntas(preguntasSeleccionadas);
    setTemaSeleccionado(tema.nombre);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
  };

  const handleSelectCantidad = (cantidad: number) => {
    setCantidadPreguntas(cantidad);
    // Si ya hay un tema seleccionado, recargar las preguntas con la nueva cantidad
    if (temaSeleccionado) {
      const temaId = temas.find((t) => t.nombre === temaSeleccionado)?.id;
      if (temaId) handleSelectTema(temaId, cantidad);
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
    <div className="flex min-h-screen bg-background text-white">
      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        {!temaSeleccionado ? (
          // Mostrar mensaje y botones para seleccionar tema          
          <div className="text-center">
            <Image
              src="/img/soldado.png" // No necesitas acceder a "src" directamente
              alt="soldado"
              width={256} // Ancho deseado
              height={256} // Alto deseado
              className="w-64 h-auto mx-auto mb-6 filter"
            />
            <h1 className="text-2xl font-bold mb-4 text-white">Selecciona Tema</h1>
            <div className="flex flex-wrap gap-4 justify-center">
              {temas.map((tema) => (
                <button
                  key={tema.id}
                  onClick={() => handleSelectTema(tema.id, cantidadPreguntas)}
                  className="w-1/3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-primary"
                >
                  {tema.nombre}
                </button>
              ))}
            </div>
            </div>  
        ) : (
          // Mostrar TestQuestionCard con las preguntas
          <>
            <Image
              src="/img/sercabologo.png" // No necesitas acceder a "src" directamente
              alt="soldado"
              width={256} // Ancho deseado
              height={256} // Alto deseado
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
        <div className="w-1/8 bg-gray-700 shadow-lg p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl text-white font-bold mb-4">Opciones</h2>
            <h3 className="text-lg font-semibold text-white mb-2">Cantidad de Preguntas</h3>
            <ul className="space-y-2 mb-6">
              {[10, 20, 30, 50].map((cantidad) => (
                <li key={cantidad}>
                  <button
                    onClick={() => handleSelectCantidad(cantidad)}
                    className={`w-full px-4 py-2 rounded ${
                      cantidadPreguntas === cantidad
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white rounded hover:bg-blue-500"
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
                    onClick={() => handleSelectTema(tema.id, cantidadPreguntas)}
                    className={`w-full px-2 py-2 text-center rounded ${
                      temaSeleccionado === tema.nombre
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
            >Inicio</button>
          </div>
        
          {/* Mostrar la imagen en la parte inferior si hay un tema seleccionado */}
          {temaSeleccionado && (
            <div className="mt-6">
              <Image
                src="/img/soldado.png"
                alt="soldado"
                width={128} // Ajusta el tamaño según sea necesario
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