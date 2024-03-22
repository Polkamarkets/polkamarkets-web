type Filter = {
  name: string;
  values: string[];
  multiple: boolean;
};

function parseFiltersFromEnv(variable: string | undefined): Filter[] {
  if (!variable) {
    return [];
  }

  try {
    const parsedFilters = JSON.parse(variable) as Filter[];

    return parsedFilters;
  } catch (error) {
    return [];
  }
}

type LinkItem = {
  title: string;
  href: string;
};

function parseLinkItemsFromEnv(variable: string | undefined): LinkItem[] {
  if (!variable) {
    return [];
  }

  try {
    const parsedVariable = JSON.parse(variable);

    return parsedVariable.filter(
      item => !!item.title && !!item.href
    ) as LinkItem[];
  } catch (error) {
    return [];
  }
}

export { parseFiltersFromEnv, parseLinkItemsFromEnv };
