import { camelizeKeys } from 'humps';
import has from 'lodash/has';

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
    const parsedVariable = JSON.parse(variable);
    const filters = parsedVariable.map(item => ({
      name: item.name,
      values: item.values,
      multiple: item.multiple
    }));

    return filters;
  } catch (error) {
    return [];
  }
}

type NavbarItem = {
  title: string;
  href: string;
};

function parseNavbarItemsFromEnv(variable: string | undefined): NavbarItem[] {
  if (!variable) {
    return [];
  }

  try {
    const parsedVariable = JSON.parse(variable);

    const navbarItems = parsedVariable.filter(item =>
      ['title', 'href'].every(key => has(item, key))
    ) as NavbarItem[];

    return navbarItems.map(({ title, href }) => ({ title, href }));
  } catch (error) {
    return [];
  }
}

export type OnboardingStep = Partial<
  Record<'title' | 'description' | 'imageUrl', string>
>;
export type OnboardingSteps = Array<OnboardingStep>;

function buildOnboardingSteps(steps?: string) {
  if (typeof steps === 'undefined') return null;

  try {
    return camelizeKeys(JSON.parse(steps)) as OnboardingSteps;
  } catch (error) {
    return null;
  }
}

export { parseFiltersFromEnv, parseNavbarItemsFromEnv, buildOnboardingSteps };
