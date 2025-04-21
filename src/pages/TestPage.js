import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { testService } from "../services/api";

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (test && timeLeft === null) {
      setTimeLeft(test.timeLimit * 60); // Конвертируем минуты в секунды
    }
  }, [test]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const data = await testService.getTestById(parseInt(testId));
      setTest(data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке теста");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    test.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / test.questions.length) * 100);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const score = calculateScore();
      await testService.saveTestResults(1, parseInt(testId), score); // Временно используем ID 1 для сотрудника
      navigate("/test-result", {
        state: {
          score,
          passingScore: test.passingScore,
          testTitle: test.title,
        },
      });
    } catch (err) {
      setError("Ошибка при сохранении результатов");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Тест не найден</div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Заголовок и таймер */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{test.title}</h1>
            <div className="text-lg font-semibold">
              Осталось времени: {formatTime(timeLeft)}
            </div>
          </div>

          {/* Прогресс */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Вопрос {currentQuestionIndex + 1} из {test.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                Отвечено на {Object.keys(answers).length} из{" "}
                {test.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / test.questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Вопрос */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestion.text}
            </h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === index
                      ? "bg-blue-50 border-blue-500"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswer(currentQuestion.id, index)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
            >
              Назад
            </button>
            {currentQuestionIndex === test.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {isSubmitting ? "Сохранение..." : "Завершить тест"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Далее
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
