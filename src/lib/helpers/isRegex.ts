type IsRegex = (string: string) => boolean;

export const isRegex: IsRegex = (string) => {
  const regexRegex = /^\/.+\/[gmisut]*$/;

  return regexRegex.test(string);
};
