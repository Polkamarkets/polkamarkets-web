export const ARIA = {
  'aria-labelledby': 'onboarding-modal-name',
  'aria-describedby': 'onboarding-modal-description'
};
export const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) =>
    ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      position: 'absolute'
    } as const)
};
export const swipeThreshold = 5000;

export function getSwipePower(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}
// ref: wrap from popmotion's lib
export function wrap(min: number, max: number, v: number): number {
  const rangeSize = max - min;

  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}
export function getButtonValue(value: string) {
  return { currentTarget: { value } } as React.MouseEvent<HTMLButtonElement>;
}
