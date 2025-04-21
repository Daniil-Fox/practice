import React, { useState } from "react";
import { Link } from "react-router-dom";

const TestsPage = () => {
  // Заглушка для тестов
  const [tests] = useState([
    {
      id: 1,
      title: "Тест по технике безопасности",
      description:
        "Проверка знаний правил техники безопасности на рабочем месте",
      questionsCount: 3,
      timeLimit: 10,
      status: "available",
    },
    {
      id: 2,
      title: "Тест по работе с оборудованием",
      description:
        "Проверка знаний правил эксплуатации производственного оборудования",
      questionsCount: 5,
      timeLimit: 15,
      status: "completed",
    },
    {
      id: 3,
      title: "Тест по пожарной безопасности",
      description: "Проверка знаний правил пожарной безопасности",
      questionsCount: 4,
      timeLimit: 12,
      status: "available",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Доступные тесты</h1>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Назад
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {test.title}
                </h2>
                {test.status === "completed" && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Завершен
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{test.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Вопросов: {test.questionsCount}</span>
                <span>Время: {test.timeLimit} мин</span>
              </div>
              <Link
                to={`/test/${test.id}`}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-center block ${
                  test.status === "completed"
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {test.status === "completed" ? "Тест пройден" : "Начать тест"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
