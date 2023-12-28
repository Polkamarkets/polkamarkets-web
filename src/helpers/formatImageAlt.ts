export default function formatImageAlt(alt?: string): string | null {
  if (!alt) return null;

  const altWithoutSpecialChars = alt.replace(/[^\w\s]/g, ' ');

  const words = altWithoutSpecialChars
    .trim()
    .split(' ')
    .filter(word => word !== '');

  const numberMatch = altWithoutSpecialChars.match(/\d+/);

  if (numberMatch) {
    const firstLetter = altWithoutSpecialChars[0];
    const number = numberMatch[0];
    return (firstLetter + number).toUpperCase();
  }

  if (words.length >= 2) {
    const firstLetters = words[0][0] + words[1][0];
    return firstLetters.toUpperCase();
  }

  return altWithoutSpecialChars.substring(0, 2).toUpperCase();
}
