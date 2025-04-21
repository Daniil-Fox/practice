import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../services/api";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EmployeeDetailsModal from "../components/EmployeeDetailsModal";
import TestManagement from "./TestManagement";
import CourseManagement from "./CourseManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("employees");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке сотрудников");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      await employeeService.createEmployee(employeeData);
      await fetchEmployees();
      setIsAddModalOpen(false);
    } catch (err) {
      setError("Ошибка при добавлении сотрудника");
      console.error(err);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этого сотрудника?")) {
      try {
        await employeeService.deleteEmployee(id);
        await fetchEmployees();
      } catch (err) {
        setError("Ошибка при удалении сотрудника");
        console.error(err);
      }
    }
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "employees":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Список сотрудников</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Добавить сотрудника
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-gray-600">{employee.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(employee)}
                        className="p-2 text-gray-600 hover:text-blue-500"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="p-2 text-gray-600 hover:text-red-500"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Роль:{" "}
                      <span className="font-medium">
                        {employee.role === "admin"
                          ? "Администратор"
                          : employee.role === "manager"
                          ? "Менеджер"
                          : "Сотрудник"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Статус:{" "}
                      <span
                        className={`font-medium ${
                          employee.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {employee.status === "active" ? "Активен" : "Неактивен"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Пройдено тестов: {employee.tests?.length || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <AddEmployeeModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddEmployee}
            />

            <EmployeeDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
              employee={selectedEmployee}
            />
          </>
        );
      case "tests":
        return <TestManagement />;
      case "courses":
        return <CourseManagement />;
      default:
        return null;
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
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Панель администратора</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              className={`px-4 py-4 border-b-2 font-medium text-sm ${
                activeTab === "employees"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("employees")}
            >
              Сотрудники
            </button>
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
