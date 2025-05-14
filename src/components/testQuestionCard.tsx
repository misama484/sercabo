import React, { useState, useEffect } from "react";
import TestQuestionOption from "@/components/testQuestionOption";

interface TestQuestionCardProps {
  pregunta: string;
  opciones: { [key: string]: string };
  respuesta_correcta: string;
  onAnswer: (isCorrect: boolean) => void;
  resetStateOnChange: any; // Prop para reiniciar estados al cambiar de pregunta
}

const TestQuestionCard: React.FC<TestQuestionCardProps> = ({
  pregunta,
  opciones,
  respuesta_correcta,
  onAnswer,
  resetStateOnChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // Reinicia los estados cuando cambie la pregunta
  useEffect(() => {
    setSelectedOption(null);
    setShowCorrectAnswer(false);
  }, [resetStateOnChange]);

  const handleOptionClick = (optionKey: string) => {
    if (selectedOption === null) {
      setSelectedOption(optionKey);
      const isCorrect = optionKey === respuesta_correcta;
      onAnswer(isCorrect);
    }
  };

  return (
    <div className="w-2/5 p-6 bg-gray-600 shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-white mb-4">Pregunta</h2>
      <p className="text-white mb-6">{pregunta}</p>
      <div className="flex flex-col gap-4">
        {Object.entries(opciones).map(([key, value]) => (
          <TestQuestionOption
            key={key}
            option={value}
            isSelected={selectedOption === key}
            isCorrect={key === respuesta_correcta}
            showCorrectAnswer={showCorrectAnswer}
            onClick={() => handleOptionClick(key)}
          />
        ))}
      </div>
      {selectedOption && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          onClick={() => setShowCorrectAnswer(true)}
        >
          Mostrar respuesta correcta
        </button>
      )}
    </div>
  );
};

export default TestQuestionCard;