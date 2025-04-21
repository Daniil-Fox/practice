import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, passingScore, testTitle } = location.state || {};

  const isPassed = score >= passingScore;

  useEffect(() => {
    // Автоматическое перенаправление через 5 секунд
    const timer = setTimeout(() => {
      handleReturn();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleReturn = () => {
    navigate("/employee-dashboard", {
      replace: true,
      state: { activeTab: "results" },
    });
  };

  if (!score) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Результаты не найдены</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{testTitle}</h1>
          <h2 className="text-2xl font-semibold mb-8">Результаты теста</h2>

          <div className="mb-8">
            <div
              className={`text-6xl font-bold mb-4 ${
                isPassed ? "text-green-500" : "text-red-500"
              }`}
            >
              {score}%
            </div>
            <p className="text-gray-600">Проходной балл: {passingScore}%</p>
          </div>

          <div className="mb-8">
            <div
              className={`text-xl font-semibold mb-2 ${
                isPassed ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPassed ? "Тест пройден" : "Тест не пройден"}
            </div>
            <p className="text-gray-600">
              {isPassed
                ? "Поздравляем! Вы успешно прошли тест."
                : "К сожалению, вы не набрали необходимое количество баллов. Попробуйте пройти тест еще раз."}
            </p>
          </div>

          <div className="text-gray-500 mb-8">
            Вы будете автоматически перенаправлены в личный кабинет через 5
            секунд
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleReturn}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Перейти в личный кабинет
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResult;
