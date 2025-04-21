import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseSelection from "./CourseSelection";
import TestSelection from "./TestSelection";
import { employeeService } from "../services/api";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      // Временно используем ID 1, в реальном приложении ID будет браться из авторизации
      const data = await employeeService.getEmployeeById(1);
      setEmployee(data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке данных сотрудника");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "courses":
        return <CourseSelection />;
      case "tests":
        return <TestSelection />;
      case "results":
        return <TestResults tests={employee?.tests || []} />;
      default:
        return <CourseSelection />;
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Верхняя панель */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold">Личный кабинет</h1>
              {employee && (
                <p className="text-gray-600">
                  {employee.firstName} {employee.lastName}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Навигационные табы */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              className={`px-4 py-4 border-b-2 font-medium text-sm ${
                activeTab === "courses"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              Учебные курсы
            </button>
            <button
              className={`px-4 py-4 border-b-2 font-medium text-sm ${
                activeTab === "tests"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("tests")}
            >
              Тесты
            </button>
            <button
              className={`px-4 py-4 border-b-2 font-medium text-sm ${
                activeTab === "results"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("results")}
            >
              Результаты тестов
            </button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">{renderContent()}</div>
    </div>
  );
};

// Компонент для отображения результатов тестов
const TestResults = ({ tests }) => {
  if (!tests || tests.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">История тестирования</h2>
        <p className="text-gray-600">У вас пока нет пройденных тестов</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">История тестирования</h2>
      <div className="grid gap-6">
        {tests.map((result, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                <p className="text-gray-600">
                  Дата прохождения: {result.completedAt}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.score >= 80
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {result.score >= 80 ? "Отлично" : "Требуется улучшение"}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Результат:</span>
                <span
                  className={`font-semibold ${
                    result.score >= 80 ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {result.score}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
