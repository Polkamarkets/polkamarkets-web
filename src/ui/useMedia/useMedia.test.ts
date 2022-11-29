import { renderHook } from '@testing-library/react-hooks';

import useMedia from './useMedia';

function mockMatchMedia({ matches }: { matches: boolean }) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(media => ({
      matches,
      media,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
}
function renderMedia() {
  return renderHook(initialProps => useMedia(initialProps.query), {
    initialProps: {
      query: '(min-width: 1024px)'
    }
  });
}
it('returns true if the provided query does matches', () => {
  mockMatchMedia({ matches: true });
  expect(renderMedia().result.current).toBe(true);
});
it('returns false if the provided query does not matches', () => {
  mockMatchMedia({ matches: false });
  expect(renderMedia().result.current).toBe(false);
});
