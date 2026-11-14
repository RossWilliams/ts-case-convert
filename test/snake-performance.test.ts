import { performance } from 'node:perf_hooks';
import * as standard from '../src/index';
import * as noSplitNumbers from '../src/no-split-numbers';

describe.each([
  ['standard', standard],
  ['no-split-numbers', noSplitNumbers],
] as const)('%s snake conversion', (_name, converters) => {
  it('given a long lowercase key, when converting, then preserves it within a generous time budget', () => {
    const key = 'a'.repeat(100_000);
    const input = { [key]: 1 };
    const start = performance.now();

    expect(converters.toSnake(key)).toBe(key);
    expect(converters.objectToSnake(input)).toEqual(input);
    expect(converters.toScreamingSnake(key)).toBe(key.toUpperCase());
    expect(converters.objectToScreamingSnake(input)).toEqual({
      [key.toUpperCase()]: 1,
    });

    // The previous quadratic search takes seconds; the fixed-width scan takes milliseconds.
    expect(performance.now() - start).toBeLessThan(1_000);
  });

  it('given a long lowercase suffix after a capital, when converting, then preserves the word boundary', () => {
    const suffix = 'a'.repeat(100_000);

    expect(converters.toSnake(`prefixB${suffix}`)).toBe(`prefix_b${suffix}`);
  });
});

it('converts every boundary without a replacement limit', () => {
  const input = 'aBaBaBaBaBaBaBaBaBaBaBaBaB';
  const expected = 'a_ba_ba_ba_ba_ba_ba_ba_ba_ba_ba_ba_ba_b';
  expect(standard.toSnake(input)).toBe(expected);
  expect(noSplitNumbers.toSnake(input)).toBe(expected);
});

it('splits every digit run without a replacement limit', () => {
  const input = 'a1b2c3d4e5f6g7h8i9j0k1l2';
  const expected: 'a_1b_2c_3d_4e_5f_6g_7h_8i_9j_0k_1l_2' = standard.toSnake(input);
  expect(expected).toBe('a_1b_2c_3d_4e_5f_6g_7h_8i_9j_0k_1l_2');
  expect(noSplitNumbers.toSnake(input)).toBe(input);
});
