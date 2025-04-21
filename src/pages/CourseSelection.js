import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/api";

const CourseSelection = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке курсов");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId) => {
    navigate(`/course/${courseId}`);
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

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Доступные курсы</h2>
        <p className="text-gray-600">На данный момент нет доступных курсов</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Доступные курсы</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCourseSelect(course.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Количество уроков: {course.lessons?.length || 0}
              </p>
              <p className="text-sm text-gray-500">
                Статус:{" "}
                <span
                  className={`font-medium ${
                    course.status === "active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {course.status === "active" ? "Активен" : "Неактивен"}
                </span>
              </p>
            </div>

            <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Начать обучение
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSelection;
