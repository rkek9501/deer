export const sortDesc = (a: any, b: any, key: any) => {
  if (a[key] < b[key]) {
    return 1;
  }
  if (a[key] > b[key]) {
    return -1;
  }
  return 0;
};
