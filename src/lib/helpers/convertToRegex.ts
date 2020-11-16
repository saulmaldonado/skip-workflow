type ConvertToRegex = (phrase: string) => RegExp;

export const convertToRegex: ConvertToRegex = (phrase) => {
  try {
    const [, regex, tags] = phrase.split('/');
    return new RegExp(regex, tags);
  } catch (error) {
    throw new Error(`Error converting "${phrase}" to RegExp`);
  }
};
