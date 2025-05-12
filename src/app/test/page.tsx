"use client";
import React, { useState } from "react";
import TestQuestionCard from "@/components/testQuestionCard";
import preguntas from "@/data/preguntas.json";




const TestPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

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

  const currentQuestion = preguntas[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        Pregunta {currentQuestionIndex + 1} de {preguntas.length}
      </h1>
      <h2 className="text-lg mb-4">
        Respuestas correctas: {correctAnswers} / {preguntas.length}
      </h2>
      <TestQuestionCard
        question={currentQuestion.pregunta}
        options={Object.values(currentQuestion.opciones)}
        correctAnswer={currentQuestion.respuesta_correcta}
        onAnswer={handleAnswer}
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
    </div>
  );
};

export default TestPage;