import { act, renderHook } from '@testing-library/react-hooks';
import mockDate from 'mockdate';

import useCookie from './useCookie';

enum Cookie {
  Key = 'KEY',
  Value = 'VALUE'
}

function renderCookie<V>(key: string, defaultValue?: V) {
  return renderHook(
    initialProps => useCookie(initialProps.key, initialProps.defaultValue),
    { initialProps: { key, defaultValue } }
  );
}

beforeEach(() => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: null
  });
  mockDate.set('1983-01-01');
});
afterEach(() => {
  mockDate.reset();
});
describe('useCookie', () => {
  it('returns null for non-stored cookie', () => {
    const { result } = renderCookie(Cookie.Key);
    const [cookie] = result.current;

    expect(cookie).toBeNull();
  });
  it('returns a stored cookie', () => {
    document.cookie = `${Cookie.Key}=${Cookie.Value}; `;

    const { result } = renderCookie(Cookie.Key);
    const [cookie] = result.current;

    expect(cookie).toBe(Cookie.Value);
  });
  it('returns a default cookie', () => {
    const { result } = renderCookie(Cookie.Key, Cookie.Value);
    const [cookie] = result.current;

    expect(cookie).toBe(Cookie.Value);
  });
  it('sets a cookie', () => {
    const { result } = renderCookie(Cookie.Key);
    const [cookie, setCookie] = result.current;

    expect(cookie).toBeNull();
    expect(typeof setCookie).toBe('function');
    act(() => setCookie(Cookie.Value));
    expect(document.cookie).toMatchSnapshot();
    expect(document.cookie).toContain(`${Cookie.Key}=${Cookie.Value};`);
  });
});
