export default function capitalize<S extends string = string>(str: S) {
  const [firstLetter, ...letters] = Array.from(str);

  return (firstLetter.toUpperCase() + letters.join('')) as Capitalize<S>;
}
