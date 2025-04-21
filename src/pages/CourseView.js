import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseService, learningProgressService } from "../services/api";

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourseById(parseInt(courseId));
      const progressData = await learningProgressService.getProgress(
        1,
        parseInt(courseId)
      ); // Временно используем ID 1 для сотрудника

      setCourse(courseData);
      setProgress(
        progressData || {
          completedModules: [],
          lastAccessedModule: 1,
          startDate: new Date().toISOString().split("T")[0],
          lastAccessDate: new Date().toISOString().split("T")[0],
        }
      );

      // Устанавливаем текущий модуль
      const lastModuleId = progressData?.lastAccessedModule || 1;
      setCurrentModule(courseData.modules.find((m) => m.id === lastModuleId));

      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке курса");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = async () => {
    try {
      if (!currentModule) return;

      await learningProgressService.completeModule(
        1,
        parseInt(courseId),
        currentModule.id
      );

      // Если есть следующий модуль, переходим к нему
      const nextModule = course.modules.find(
        (m) => m.id === currentModule.id + 1
      );
      if (nextModule) {
        setCurrentModule(nextModule);
      } else {
        // Если это был последний модуль, перенаправляем на тест
        if (course.requiredTests.length > 0) {
          navigate(`/test/${course.requiredTests[0]}`);
        }
      }

      // Обновляем прогресс
      await fetchCourseData();
    } catch (err) {
      setError("Ошибка при сохранении прогресса");
      console.error(err);
    }
  };

  const handleModuleSelect = (moduleId) => {
    const module = course.modules.find((m) => m.id === moduleId);
    if (module) {
      setCurrentModule(module);
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

  if (!course || !currentModule) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Курс не найден</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <button
          onClick={() => navigate("/courses")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Вернуться к списку курсов
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Сайдбар с модулями */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Модули курса</h2>
            <div className="space-y-2">
              {course.modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect(module.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    currentModule.id === module.id
                      ? "bg-blue-500 text-white"
                      : progress.completedModules.includes(module.id)
                      ? "bg-green-100 text-green-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {module.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {currentModule.title}
            </h2>
            <div className="prose max-w-none mb-8">{currentModule.content}</div>

            {/* Материалы модуля */}
            {currentModule.materials && currentModule.materials.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Материалы</h3>
                <div className="space-y-4">
                  {currentModule.materials.map((material, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      {material.type === "text" && (
                        <div className="prose">{material.content}</div>
                      )}
                      {material.type === "video" && (
                        <div className="aspect-w-16 aspect-h-9">
                          <video
                            src={material.url}
                            controls
                            className="rounded-lg"
                          />
                        </div>
                      )}
                      {material.type === "pdf" && (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-500 hover:text-blue-600"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Открыть PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопка завершения модуля */}
            <div className="flex justify-end">
              <button
                onClick={handleModuleComplete}
                className={`px-6 py-2 rounded-lg ${
                  progress.completedModules.includes(currentModule.id)
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {progress.completedModules.includes(currentModule.id)
                  ? "Модуль пройден"
                  : "Завершить модуль"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
