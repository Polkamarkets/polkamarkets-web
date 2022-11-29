import { renderHook } from '@testing-library/react-hooks';

import useMedia from './useMedia';

const query = '(min-width: 1024px)';

function mockMatchMedia({ matches }: { matches: boolean }) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(_query => ({
      matches,
      media: _query,
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
      query
    }
  });
}

describe('useMedia', () => {
  it('returns true if the provided query does matches', () => {
    mockMatchMedia({ matches: true });

    const { result } = renderMedia();

    expect(result.current).toBeTruthy();
  });

  it('returns false if the provided query does not matches', () => {
    mockMatchMedia({ matches: false });

    const { result } = renderMedia();

    expect(result.current).toBeFalsy();
  });
});
