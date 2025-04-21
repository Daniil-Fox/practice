import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AuthModal = ({ isOpen, onClose, onAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  useEffect(() => {
    if (role) {
      setEmail(role === "admin" ? "admin@example.com" : "user@example.com");
    }
  }, [role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Проверка соответствия роли и учетных данных
    if (
      role === "admin" &&
      email === "admin@example.com" &&
      password === "admin123"
    ) {
      onAuth({ role: "admin", email });
    } else if (
      role === "employee" &&
      email === "user@example.com" &&
      password === "user123"
    ) {
      onAuth({ role: "employee", email });
    } else {
      setError("Неверный email или пароль");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Вход в систему как {role === "admin" ? "администратор" : "сотрудник"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Закрыть
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Войти
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          <p className="text-center">Тестовые аккаунты:</p>
          <p className="text-center">Админ: admin@example.com / admin123</p>
          <p className="text-center">Сотрудник: user@example.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
