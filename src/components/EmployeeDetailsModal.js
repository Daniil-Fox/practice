import React from "react";

const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-gray-600">{employee.role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{employee.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Статус</h3>
              <p className="mt-1">{employee.status}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Результаты тестов</h3>
            {employee.tests && employee.tests.length > 0 ? (
              <div className="space-y-4">
                {employee.tests.map((test, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{test.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Дата прохождения: {test.completedAt}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          test.score >= 80
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {test.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Нет пройденных тестов</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
