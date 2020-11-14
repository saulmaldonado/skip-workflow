type RemoveExtraneousWhiteSpace = (string: string) => string;

export const removeExtraneousWhiteSpace: RemoveExtraneousWhiteSpace = (
  string,
) => string.replace(/\s+/g, ' ').trim();
