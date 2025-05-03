export const getGreeting = (): string => {
  const hour = new Date().getHours();

  const greetings = [
    { start: 5, end: 12, message: "Good morning" },
    { start: 12, end: 17, message: "Good afternoon" },
    { start: 17, end: 21, message: "Good evening" },
    { start: 21, end: 24, message: "Good night" },
    { start: 0, end: 5, message: "Good night" },
  ];

  const greeting = greetings.find(
    ({ start, end }) => hour >= start && hour < end
  );
  return greeting?.message ?? "Hello";
};
