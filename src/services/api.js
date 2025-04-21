// Базовый URL API
const API_URL = "http://localhost:3000/api";

// Временные данные для тестирования
const mockEmployees = [
  {
    id: 1,
    email: "ivan.ivanov@example.com",
    firstName: "Иван",
    lastName: "Иванов",
    role: "employee",
    status: "active",
    tests: [
      {
        title: "Тест по безопасности",
        score: 85,
        completedAt: "2024-04-18",
      },
      {
        title: "Тест по продукту",
        score: 75,
        completedAt: "2024-04-17",
      },
    ],
  },
  {
    id: 2,
    email: "petr.petrov@example.com",
    firstName: "Петр",
    lastName: "Петров",
    role: "manager",
    status: "active",
    tests: [],
  },
  {
    id: 3,
    email: "anna.sidorova@example.com",
    firstName: "Анна",
    lastName: "Сидорова",
    role: "admin",
    status: "active",
    tests: [],
  },
];

// Временные данные для тестов
let mockTests = [
  {
    id: 1,
    title: "Тест по безопасности",
    description: "Проверка знаний по технике безопасности",
    questions: [
      {
        id: 1,
        text: "Что нужно делать при обнаружении пожара?",
        options: [
          "Позвонить в пожарную службу",
          "Попытаться потушить самостоятельно",
          "Эвакуироваться",
          "Все вышеперечисленное",
        ],
        correctAnswer: 3,
      },
      {
        id: 2,
        text: "Как часто нужно проходить инструктаж по технике безопасности?",
        options: [
          "Раз в год",
          "Раз в полгода",
          "При приеме на работу",
          "Все вышеперечисленное",
        ],
        correctAnswer: 3,
      },
    ],
    timeLimit: 30,
    passingScore: 80,
  },
  {
    id: 2,
    title: "Тест по продукту",
    description: "Проверка знаний о продуктах компании",
    questions: [
      {
        id: 1,
        text: "Какой продукт является флагманским?",
        options: ["Product A", "Product B", "Product C", "Product D"],
        correctAnswer: 0,
      },
      {
        id: 2,
        text: "Какие преимущества у нашего продукта?",
        options: [
          "Высокая производительность",
          "Низкая стоимость",
          "Простота использования",
          "Все вышеперечисленное",
        ],
        correctAnswer: 3,
      },
    ],
    timeLimit: 20,
    passingScore: 70,
  },
];

// Временные данные для курсов
let mockCourses = [
  {
    id: 1,
    title: "Введение в безопасность",
    description: "Базовый курс по основам информационной безопасности",
    status: "active",
    lessons: [
      {
        id: 1,
        title: "Основы информационной безопасности",
        content: "Содержание урока по основам ИБ...",
        type: "text",
        order: 1,
      },
      {
        id: 2,
        title: "Защита персональных данных",
        content: "Содержание урока по защите ПД...",
        type: "text",
        order: 2,
        media: {
          type: "image",
          url: "/images/data-protection.jpg",
        },
      },
    ],
  },
];

// Временные данные по прогрессу обучения
let mockLearningProgress = [
  {
    employeeId: 1,
    courseId: 1,
    progress: {
      completedModules: [1],
      lastAccessedModule: 2,
      startDate: "2024-03-01",
      lastAccessDate: "2024-03-15",
    },
  },
];

const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// Сервис для работы с сотрудниками
export const employeeService = {
  // Получение списка сотрудников
  getEmployees: async () => {
    try {
      // Временное решение - возвращаем моковые данные
      return mockEmployees;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Получение сотрудника по ID
  getEmployeeById: async (id) => {
    try {
      // Временное решение - ищем сотрудника в моковых данных
      const employee = mockEmployees.find((emp) => emp.id === id);
      if (!employee) {
        throw new Error("Сотрудник не найден");
      }
      return employee;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Создание нового сотрудника
  createEmployee: async (employeeData) => {
    try {
      // Временное решение - добавляем сотрудника в моковые данные
      const newEmployee = {
        id: mockEmployees.length + 1,
        ...employeeData,
        tests: [],
      };
      mockEmployees.push(newEmployee);
      return newEmployee;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Обновление данных сотрудника
  updateEmployee: async (id, employeeData) => {
    try {
      // Временное решение - обновляем данные в моковых данных
      const index = mockEmployees.findIndex((emp) => emp.id === id);
      if (index !== -1) {
        mockEmployees[index] = { ...mockEmployees[index], ...employeeData };
        return mockEmployees[index];
      }
      throw new Error("Сотрудник не найден");
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Удаление сотрудника
  deleteEmployee: async (id) => {
    try {
      // Временное решение - удаляем сотрудника из моковых данных
      const index = mockEmployees.findIndex((emp) => emp.id === id);
      if (index !== -1) {
        mockEmployees.splice(index, 1);
        return true;
      }
      throw new Error("Сотрудник не найден");
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },
};

// Сервис для работы с тестами
export const testService = {
  // Получение списка тестов
  getTests: async () => {
    try {
      return mockTests;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Получение теста по ID
  getTestById: async (id) => {
    try {
      const test = mockTests.find((t) => t.id === id);
      if (!test) {
        throw new Error("Тест не найден");
      }
      return test;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Создание нового теста
  createTest: async (testData) => {
    try {
      const newTest = {
        id: mockTests.length + 1,
        ...testData,
      };
      mockTests.push(newTest);
      return newTest;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Обновление теста
  updateTest: async (id, testData) => {
    try {
      const index = mockTests.findIndex((t) => t.id === id);
      if (index !== -1) {
        mockTests[index] = { ...mockTests[index], ...testData };
        return mockTests[index];
      }
      throw new Error("Тест не найден");
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Удаление теста
  deleteTest: async (id) => {
    try {
      const index = mockTests.findIndex((t) => t.id === id);
      if (index !== -1) {
        mockTests.splice(index, 1);
        return true;
      }
      throw new Error("Тест не найден");
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Сохранение результатов теста
  saveTestResults: async (employeeId, testId, score) => {
    try {
      const employee = mockEmployees.find((emp) => emp.id === employeeId);
      if (!employee) {
        throw new Error("Сотрудник не найден");
      }

      const test = mockTests.find((t) => t.id === testId);
      if (!test) {
        throw new Error("Тест не найден");
      }

      const testResult = {
        title: test.title,
        score,
        completedAt: new Date().toISOString().split("T")[0],
      };

      if (!employee.tests) {
        employee.tests = [];
      }

      employee.tests.push(testResult);
      return testResult;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },
};

// Сервис для работы с курсами
export const courseService = {
  getCourses: async () => {
    await simulateDelay();
    return mockCourses;
  },

  getCourseById: async (id) => {
    await simulateDelay();
    const course = mockCourses.find((c) => c.id === id);
    if (!course) {
      throw new Error("Курс не найден");
    }
    return course;
  },

  createCourse: async (courseData) => {
    await simulateDelay();
    const newCourse = {
      id: mockCourses.length + 1,
      ...courseData,
    };
    mockCourses.push(newCourse);
    return newCourse;
  },

  updateCourse: async (id, courseData) => {
    await simulateDelay();
    const index = mockCourses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Курс не найден");
    }
    mockCourses[index] = { ...mockCourses[index], ...courseData };
    return mockCourses[index];
  },

  deleteCourse: async (id) => {
    await simulateDelay();
    const index = mockCourses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Курс не найден");
    }
    mockCourses.splice(index, 1);
  },

  addLesson: async (courseId, lessonData) => {
    await simulateDelay();
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) {
      throw new Error("Курс не найден");
    }
    const newLesson = {
      id: course.lessons.length + 1,
      order: course.lessons.length + 1,
      ...lessonData,
    };
    course.lessons.push(newLesson);
    return newLesson;
  },

  updateLesson: async (courseId, lessonId, lessonData) => {
    await simulateDelay();
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) {
      throw new Error("Курс не найден");
    }
    const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex === -1) {
      throw new Error("Урок не найден");
    }
    course.lessons[lessonIndex] = {
      ...course.lessons[lessonIndex],
      ...lessonData,
    };
    return course.lessons[lessonIndex];
  },

  deleteLesson: async (courseId, lessonId) => {
    await simulateDelay();
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) {
      throw new Error("Курс не найден");
    }
    const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex === -1) {
      throw new Error("Урок не найден");
    }
    course.lessons.splice(lessonIndex, 1);
    // Обновляем порядок оставшихся уроков
    course.lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });
  },
};

// Сервис для работы с прогрессом обучения
export const learningProgressService = {
  // Получение прогресса сотрудника по курсу
  getProgress: async (employeeId, courseId) => {
    try {
      const progress = mockLearningProgress.find(
        (p) => p.employeeId === employeeId && p.courseId === courseId
      );
      return progress?.progress || null;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Обновление прогресса
  updateProgress: async (employeeId, courseId, progressData) => {
    try {
      let progress = mockLearningProgress.find(
        (p) => p.employeeId === employeeId && p.courseId === courseId
      );

      if (progress) {
        progress.progress = { ...progress.progress, ...progressData };
      } else {
        progress = {
          employeeId,
          courseId,
          progress: {
            completedModules: [],
            lastAccessedModule: 1,
            startDate: new Date().toISOString().split("T")[0],
            lastAccessDate: new Date().toISOString().split("T")[0],
            ...progressData,
          },
        };
        mockLearningProgress.push(progress);
      }

      return progress.progress;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },

  // Отметка модуля как завершенного
  completeModule: async (employeeId, courseId, moduleId) => {
    try {
      const progress = await learningProgressService.getProgress(
        employeeId,
        courseId
      );
      if (!progress) {
        throw new Error("Прогресс не найден");
      }

      if (!progress.completedModules.includes(moduleId)) {
        progress.completedModules.push(moduleId);
        progress.lastAccessedModule = moduleId;
        progress.lastAccessDate = new Date().toISOString().split("T")[0];
      }

      return await learningProgressService.updateProgress(
        employeeId,
        courseId,
        progress
      );
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  },
};
