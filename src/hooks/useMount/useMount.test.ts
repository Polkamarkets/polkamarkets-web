import { renderHook } from '@testing-library/react-hooks';

import useMount from './useMount';

describe('useMount', () => {
  it('returns true when the component did mount', () => {
    const { result } = renderHook(() => useMount());

    expect(result.current.current).toBeTruthy();
  });
  it('returns false when the component will unmount', () => {
    const { result, unmount } = renderHook(() => useMount());

    unmount();
    expect(result.current.current).toBeFalsy();
  });
});
