export const getMonthAndDay = (date: Date) => {
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  return `${month}/${day}`;
};

export const getFullDate = (date: Date) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  return `${year}/${month}/${day}`;
};
