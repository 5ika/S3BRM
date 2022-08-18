export const getStartOfDay = (date: Date): Date =>
  new Date(new Date(date).setHours(0, 0, 0, 0));

export const getStartOfWeek = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day == 0 ? -6 : 1);
  const startOfWeek = new Date(new Date(date).setDate(diff));
  return getStartOfDay(startOfWeek);
};

export const getStartOfMonth = (date: Date): Date =>
  getStartOfDay(new Date(date.getFullYear(), date.getMonth(), 1));

export const isSameDate = (dateA: Date, dateB: Date): boolean => {
  if (dateA.getDate() !== dateB.getDate()) return false;
  else if (dateA.getMonth() !== dateB.getMonth()) return false;
  else if (dateA.getFullYear() !== dateB.getFullYear()) return false;
  else return true;
};
