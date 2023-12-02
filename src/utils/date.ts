export const getMonthAndDay = (date: Date) => {
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  const monthWithZero = month.toString().padStart(2, "0");
  const dayWithZero = day.toString().padStart(2, "0");
  return `${monthWithZero}/${dayWithZero}`;
};

export const getFullDate = (date: Date) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  const yearWithZero = year.toString().padStart(2, "0");
  const monthWithZero = month.toString().padStart(2, "0");
  const dayWithZero = day.toString().padStart(2, "0");
  return `${yearWithZero}/${monthWithZero}/${dayWithZero}`;
};
