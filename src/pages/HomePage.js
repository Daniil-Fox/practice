import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Система тестирования
          </h1>
          <p className="text-gray-600">Выберите роль для входа в систему</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect("admin")}
            className="w-full py-4 px-6 bg-blue-500 text-white rounded-lg text-center font-medium hover:bg-blue-600 transition-colors"
          >
            Войти как администратор
          </button>

          <button
            onClick={() => handleRoleSelect("employee")}
            className="w-full py-4 px-6 bg-green-500 text-white rounded-lg text-center font-medium hover:bg-green-600 transition-colors"
          >
            Войти как сотрудник
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
