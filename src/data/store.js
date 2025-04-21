// Временное хранилище данных (в реальном приложении будет API)
const store = {
  employees: [
    {
      id: 1,
      name: "Иван Иванов",
      email: "user@example.com",
      position: "Сотрудник отдела разработки",
      tests: [
        {
          testId: 1,
          title: "Тест по технике безопасности",
          score: 85,
          date: "2024-04-18",
          status: "completed",
        },
        {
          testId: 2,
          title: "Тест по работе с оборудованием",
          score: 90,
          date: "2024-04-17",
          status: "completed",
        },
      ],
    },
    {
      id: 2,
      name: "Петр Петров",
      email: "petr@example.com",
      position: "Сотрудник отдела тестирования",
      tests: [
        {
          testId: 1,
          title: "Тест по технике безопасности",
          score: 75,
          date: "2024-04-18",
          status: "completed",
        },
      ],
    },
  ],
  tests: [
    {
      id: 1,
      title: "Тест по технике безопасности",
      description:
        "Проверка знаний правил техники безопасности на рабочем месте",
      questionsCount: 3,
      timeLimit: 10,
      questions: [
        {
          id: 1,
          text: "Что нужно делать при обнаружении пожара?",
          options: [
            "Позвонить в пожарную службу",
            "Попытаться потушить самостоятельно",
            "Продолжить работу",
            "Спрятаться",
          ],
          correctAnswer: 0,
        },
        {
          id: 2,
          text: "Как правильно использовать огнетушитель?",
          options: [
            "Направить на огонь и нажать рычаг",
            "Размахивать им над головой",
            "Бросить в огонь",
            "Использовать как молоток",
          ],
          correctAnswer: 0,
        },
        {
          id: 3,
          text: "Что делать при утечке газа?",
          options: [
            "Открыть окна и вызвать газовую службу",
            "Зажечь спичку для проверки",
            "Продолжить работу",
            "Ничего не делать",
          ],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: 2,
      title: "Тест по работе с оборудованием",
      description:
        "Проверка знаний правил эксплуатации производственного оборудования",
      questionsCount: 5,
      timeLimit: 15,
      questions: [
        {
          id: 1,
          text: "Как правильно включать станок?",
          options: [
            "Проверить состояние и включить",
            "Включить сразу",
            "Попросить коллегу включить",
            "Не включать никогда",
          ],
          correctAnswer: 0,
        },
      ],
    },
  ],
};

// Функции для работы с данными
export const getEmployees = () => store.employees;
export const getTests = () => store.tests;
export const getEmployeeById = (id) =>
  store.employees.find((emp) => emp.id === id);
export const getTestById = (id) => store.tests.find((test) => test.id === id);

export const addEmployee = (employee) => {
  const newEmployee = {
    ...employee,
    id: store.employees.length + 1,
    tests: [],
  };
  store.employees.push(newEmployee);
  return newEmployee;
};

export const deleteEmployee = (id) => {
  const index = store.employees.findIndex((emp) => emp.id === id);
  if (index !== -1) {
    store.employees.splice(index, 1);
    return true;
  }
  return false;
};

export const updateTestResults = (employeeId, testId, score) => {
  const employee = getEmployeeById(employeeId);
  if (employee) {
    const test = getTestById(testId);
    const existingTest = employee.tests.find((t) => t.testId === testId);

    if (existingTest) {
      existingTest.score = score;
      existingTest.date = new Date().toISOString().split("T")[0];
    } else {
      employee.tests.push({
        testId,
        title: test.title,
        score,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
      });
    }
    return true;
  }
  return false;
};

export default store;
