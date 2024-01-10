/* eslint-disable import/prefer-default-export */
import { camelizeKeys } from 'humps';

import { Step } from './Onboarding.type';

export function buildOnboardingSteps(steps: string | undefined): Step[] {
  if (!steps) {
    return [];
  }

  try {
    const parsedSteps = camelizeKeys(JSON.parse(steps));

    const onboardingSteps = parsedSteps.filter(item =>
      ['title', 'description'].every(key => item[key])
    ) as Step[];

    return onboardingSteps.map(({ title, description, imageUrl }) => ({
      title,
      description,
      imageUrl: imageUrl || null
    }));
  } catch (error) {
    return [];
  }
}
