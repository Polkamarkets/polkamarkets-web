const categoricalColors = [
  'categorical-0',
  'categorical-1',
  'categorical-2',
  'categorical-3',
  'categorical-4',
  'categorical-5',
  'categorical-6',
  'categorical-7',
  'categorical-8',
  'categorical-9',
  'categorical-10',
  'categorical-11'
] as const;

export type CategoricalColor = (typeof categoricalColors)[number];

const categoricalColorsInHex = [
  '#0fb5ae',
  '#4046ca',
  '#f68510',
  '#de3d82',
  '#7e84fa',
  '#72e06a',
  '#127af3',
  '#7226d3',
  '#e8c603',
  '#cb5d00',
  '#008f5d',
  '#bce931'
];

function colorByOutcomeId(outcomeId: number | string) {
  const index = parseInt(outcomeId.toString(), 10) % 12;
  return categoricalColors[index];
}

export { categoricalColors, categoricalColorsInHex, colorByOutcomeId };
