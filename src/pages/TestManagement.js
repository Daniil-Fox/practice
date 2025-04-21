import React, { useState, useEffect } from "react";
import { testService } from "../services/api";

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    passingScore: 80,
    questions: [],
  });

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

  const handleAddTest = async () => {
    try {
      await testService.createTest(formData);
      await fetchTests();
      setIsAddModalOpen(false);
      setFormData({
        title: "",
        description: "",
        timeLimit: 30,
        passingScore: 80,
        questions: [],
      });
    } catch (err) {
      setError("Ошибка при создании теста");
      console.error(err);
    }
  };

  const handleEditTest = async () => {
    try {
      await testService.updateTest(selectedTest.id, formData);
      await fetchTests();
      setIsEditModalOpen(false);
      setSelectedTest(null);
      setFormData({
        title: "",
        description: "",
        timeLimit: 30,
        passingScore: 80,
        questions: [],
      });
    } catch (err) {
      setError("Ошибка при обновлении теста");
      console.error(err);
    }
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот тест?")) {
      try {
        await testService.deleteTest(id);
        await fetchTests();
      } catch (err) {
        setError("Ошибка при удалении теста");
        console.error(err);
      }
    }
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          text: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value,
      };
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex].options[optionIndex] = value;
      return {
        ...prev,
        questions: newQuestions,
      };
    });
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление тестами</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Создать тест
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div key={test.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{test.title}</h2>
                <p className="text-gray-600">{test.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTest(test);
                    setFormData(test);
                    setIsEditModalOpen(true);
                  }}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTest(test.id)}
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
                Время на прохождение: {test.timeLimit} мин
              </p>
              <p className="text-sm text-gray-500">
                Проходной балл: {test.passingScore}%
              </p>
              <p className="text-sm text-gray-500">
                Количество вопросов: {test.questions.length}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно создания/редактирования теста */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">
                {isAddModalOpen ? "Создание теста" : "Редактирование теста"}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setFormData({
                    title: "",
                    description: "",
                    timeLimit: 30,
                    passingScore: 80,
                    questions: [],
                  });
                }}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название теста
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Время на прохождение (мин)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        timeLimit: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Проходной балл (%)
                  </label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        passingScore: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Вопросы</h3>
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Добавить вопрос
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.questions.map((question, questionIndex) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Текст вопроса
                        </label>
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) =>
                            handleQuestionChange(
                              questionIndex,
                              "text",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Варианты ответов
                        </label>
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              name={`correct-answer-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() =>
                                handleQuestionChange(
                                  questionIndex,
                                  "correctAnswer",
                                  optionIndex
                                )
                              }
                              className="w-4 h-4"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder={`Вариант ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={isAddModalOpen ? handleAddTest : handleEditTest}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {isAddModalOpen ? "Создать" : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
