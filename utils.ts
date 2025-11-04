// utils.ts

/**
 * Normalizes a string for searching by converting to lowercase, removing accents, and trimming whitespace.
 * @param text The text to normalize.
 * @returns The normalized string.
 */
export const normalizeText = (text: string | null | undefined): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};
