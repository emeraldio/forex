export const validateFloat = (str: string): boolean =>
  !Number.isNaN(Number.parseFloat(str));
