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

  it.each([
    ['', ''],
    ['A', 'a'],
    ['ABC', 'a_b_c'],
    ['_ABC', '__a_b_c'],
    ['a\nBC\rDE\u2028FG\u2029HI', 'a\nb_c\rd_e\u2028f_g\u2029h_i'],
    ['ABCDEFGHIJKLM', 'a_b_c_d_e_f_g_h_i_j_klm'],
  ])('given %j, when converting capitals, then returns %j', (input, expected) => {
    expect(converters.toSnake(input)).toBe(expected);
    expect(converters.toScreamingSnake(input)).toBe(expected.toUpperCase());
  });

  it('given a long lowercase suffix after a capital, when converting, then preserves the word boundary', () => {
    const suffix = 'a'.repeat(100_000);

    expect(converters.toSnake(`prefixB${suffix}`)).toBe(`prefix_b${suffix}`);
  });
});

it('given number splits, when converting capitals, then preserves the shared replacement limit', () => {
  expect(standard.toSnake('a1b2ABCDEFGHIJK')).toBe('a_1b_2_a_b_c_d_e_f_g_hijk');
  expect(noSplitNumbers.toSnake('a1b2ABCDEFGHIJK')).toBe('a1b2_a_b_c_d_e_f_g_h_i_jk');
});
