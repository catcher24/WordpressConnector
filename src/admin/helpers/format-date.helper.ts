export const formatDate = (
  dateOrObj?: any,
  field?: string
): string => {
  let dateValue = dateOrObj;

  if (dateOrObj && typeof dateOrObj === 'object' && !(dateOrObj instanceof Date) && field) {
    dateValue = dateOrObj[field];
  }

  if (!dateValue) return "N/A";

  const date = new Date(dateValue);

  return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};
