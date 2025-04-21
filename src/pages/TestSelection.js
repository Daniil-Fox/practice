import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { testService } from "../services/api";

const TestSelection = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await testService.getTests();
      setTests(data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке тестов");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (testId) => {
    navigate(`/test/${testId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Доступные тесты</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleTestSelect(test.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
            <p className="text-gray-600 mb-4">{test.description}</p>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Количество вопросов: {test.questions.length}
              </p>
              <p className="text-sm text-gray-500">
                Время на прохождение: {test.timeLimit} мин
              </p>
              <p className="text-sm text-gray-500">
                Проходной балл: {test.passingScore}%
              </p>
            </div>

            <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Начать тестирование
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSelection;
