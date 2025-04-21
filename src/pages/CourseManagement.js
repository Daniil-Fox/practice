import React, { useState, useEffect } from "react";
import { courseService } from "../services/api";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

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

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот курс?")) {
      try {
        await courseService.deleteCourse(id);
        await fetchCourses();
      } catch (err) {
        setError("Ошибка при удалении курса");
        console.error(err);
      }
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Управление курсами</h2>
        <button
          onClick={handleAddCourse}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Добавить курс
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCourse(course)}
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
                  onClick={() => handleDeleteCourse(course.id)}
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
          </div>
        ))}
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={editingCourse}
        onSave={fetchCourses}
      />
    </div>
  );
};

const CourseModal = ({ isOpen, onClose, course, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    lessons: [],
  });
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "active",
        lessons: [],
      });
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (course) {
        await courseService.updateCourse(course.id, formData);
      } else {
        await courseService.createCourse(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLesson = () => {
    setCurrentLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setCurrentLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот урок?")) {
      setFormData((prev) => ({
        ...prev,
        lessons: prev.lessons.filter((l) => l.id !== lessonId),
      }));
    }
  };

  const handleSaveLesson = (lessonData) => {
    setFormData((prev) => {
      const lessons = [...prev.lessons];
      if (currentLesson) {
        const index = lessons.findIndex((l) => l.id === currentLesson.id);
        if (index !== -1) {
          lessons[index] = { ...currentLesson, ...lessonData };
        }
      } else {
        lessons.push({
          id: lessons.length + 1,
          order: lessons.length + 1,
          ...lessonData,
        });
      }
      return { ...prev, lessons };
    });
    setIsLessonModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {course ? "Редактировать курс" : "Добавить курс"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название курса
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Уроки</h3>
                <button
                  type="button"
                  onClick={handleAddLesson}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Добавить урок
                </button>
              </div>
              <div className="space-y-4">
                {formData.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-medium">{lesson.title}</h4>
                      <p className="text-sm text-gray-600">
                        {lesson.type === "text"
                          ? "Текстовый урок"
                          : "Медиа урок"}
                      </p>
                      {lesson.media && (
                        <p className="text-sm text-gray-600">
                          Медиа: {lesson.media.type}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditLesson(lesson)}
                        className="p-1 text-gray-600 hover:text-blue-500"
                      >
                        <svg
                          className="w-4 h-4"
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
                        type="button"
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-1 text-gray-600 hover:text-red-500"
                      >
                        <svg
                          className="w-4 h-4"
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
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {course ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>

      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSave={handleSaveLesson}
        lesson={currentLesson}
      />
    </div>
  );
};

const LessonModal = ({ isOpen, onClose, onSave, lesson }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "text",
    media: null,
  });

  useEffect(() => {
    if (lesson) {
      setFormData(lesson);
    } else {
      setFormData({
        title: "",
        content: "",
        type: "text",
        media: null,
      });
    }
  }, [lesson]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // В реальном приложении здесь будет загрузка файла на сервер
      // Сейчас просто сохраняем информацию о файле
      setFormData((prev) => ({
        ...prev,
        media: {
          type: file.type.startsWith("image/") ? "image" : "video",
          url: URL.createObjectURL(file),
          fileName: file.name,
        },
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-xl font-semibold mb-4">
          {lesson ? "Редактировать урок" : "Добавить урок"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название урока
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип урока
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="text">Текстовый</option>
              <option value="media">Медиа</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Содержание
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
              rows={6}
              required
            />
          </div>
          {formData.type === "media" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Медиа файл
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="w-full"
              />
              {formData.media && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Выбран файл: {formData.media.fileName}
                  </p>
                  {formData.media.type === "image" && (
                    <img
                      src={formData.media.url}
                      alt="Preview"
                      className="mt-2 max-h-40 rounded"
                    />
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {lesson ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseManagement;
