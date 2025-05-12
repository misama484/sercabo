import React, { useState } from "react";
import TestQuestionOption from "@/components/testQuestionOption";

interface TestQuestionCardProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onAnswer: (isCorrect: boolean) => void;
}

const TestQuestionCard: React.FC<TestQuestionCardProps> = ({
  question,
  options,
  correctAnswer,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleOptionClick = (option: string) => {
    if (selectedOption === null) {
      setSelectedOption(option);
      const isCorrect = option === correctAnswer;
      onAnswer(isCorrect);
    }
  };

  return (
    <div className="w-2/5 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Pregunta</h2>
      <p className="text-gray-700 mb-6">{question}</p>
      <div className="flex flex-col gap-4">
        {options.map((option, index) => (
          <TestQuestionOption
            key={index}
            option={option}
            isSelected={selectedOption === option}
            isCorrect={option === correctAnswer}
            showCorrectAnswer={showCorrectAnswer}
            onClick={() => handleOptionClick(option)}
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