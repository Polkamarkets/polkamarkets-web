import capitalize from './capitalize';

it('capitalize a string', () => {
  expect(capitalize('foo')).toMatch(/Foo/);
});
