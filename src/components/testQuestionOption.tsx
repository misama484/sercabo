import React from "react";

interface TestQuestionOptionProps {
  option: string;
  isSelected: boolean;
  isCorrect: boolean;
  showCorrectAnswer: boolean;
  onClick: () => void;
}

const TestQuestionOption: React.FC<TestQuestionOptionProps> = ({
  option,
  isSelected,
  isCorrect,
  showCorrectAnswer,
  onClick,
}) => {
  let bgColor = "bg-gray-100";
  if (isSelected) {
    bgColor = isCorrect ? "bg-green-200" : "bg-red-200";
  } else if (showCorrectAnswer && isCorrect) {
    bgColor = "bg-green-200";
  }

  return (
    <div
      className={`w-full p-4 ${bgColor} hover:bg-gray-200 rounded-lg border border-gray-300 cursor-pointer`}
      onClick={onClick}
    >
      <p className="text-gray-800">{option}</p>
    </div>
  );
};

export default TestQuestionOption;