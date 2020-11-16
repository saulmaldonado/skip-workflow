type IsRegex = (string: string | RegExp) => string is RegExp;

export const isRegex: IsRegex = (string): string is RegExp => {
  const regexRegex = /^\/.+\/[gmisut]*$/;

  return regexRegex.test(string as string);
};
