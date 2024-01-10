import type { TournamentDescriptionItem } from './TournamentHero.type';

function matchesDynamicDescription(string: string): boolean {
  const regex: RegExp =
    /\[(.*?)\]\((.*?)\)\{(default|primary)(\s+underline)?\}/g;

  return regex.test(string);
}

function getDescriptionItems(string: string): TournamentDescriptionItem[] {
  const regex: RegExp =
    /\[(.*?)\]\((.*?)\)\{(default|primary)(\s+underline)?\}/g;

  const matchesArray: TournamentDescriptionItem[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  match = regex.exec(string);

  while (match !== null) {
    const nonMatch = string.slice(index, match.index);

    if (nonMatch !== '') {
      matchesArray.push({ text: nonMatch, isLink: false });
    }

    const text = match[1];
    const url = match[2];
    const color = match[3] as TournamentDescriptionItem['color'];
    const underline = !!match[4];

    matchesArray.push({ text, url, color, underline, isLink: true });
    index = regex.lastIndex;
    match = regex.exec(string);
  }

  const remainingText = string.slice(index);
  if (remainingText !== '') {
    matchesArray.push({ text: remainingText, isLink: false });
  }

  return matchesArray;
}

export { matchesDynamicDescription, getDescriptionItems };
