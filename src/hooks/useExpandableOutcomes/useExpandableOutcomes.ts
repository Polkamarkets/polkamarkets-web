import { useCallback, useState } from 'react';

import type { SortedOutcomes } from 'helpers/sortOutcomes';

type UseExpandableOutcomes = {
  max?: number;
  outcomes: SortedOutcomes;
};

export default function useExpandableOutcomes({
  max = 2,
  outcomes
}: UseExpandableOutcomes) {
  const [isExpanded, setExpanded] = useState(false);
  const off = isExpanded ? [] : outcomes.slice(max);

  return {
    isExpanded,
    expand: useCallback(() => setExpanded(true), []),
    onseted: isExpanded ? outcomes : outcomes.slice(0, max),
    offseted: {
      primary: `${off.length}+ Outcomes`,
      secondary: {
        text: `${off.map(outcome => outcome.title).join(', ')}`,
        price: +(
          off.reduce((prices, outcome) => outcome.price + prices, 0) /
          off.length
        ).toFixed(3)
      }
    },
    off
  } as const;
}
