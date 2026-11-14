import * as standard from '../src/index';
import * as noSplitNumbers from '../src/no-split-numbers';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;

const date = new Date('2026-01-02T03:04:05Z');
const bytes: Uint8Array = new Uint8Array([1, 2, 3]);
const input = {
  'HTTPServer': {
    API_VERSION: [{ a__b: 'value', trailing_: 3 }],
    date_value: date,
    byte_value: bytes,
    null_value: null,
    undefined_value: undefined,
    primitive_values: [1, 'do_not_convert', true, null, undefined],
  },
  '-1': 'negative',
  '+1.25': 'decimal',
  '42': 'numeric',
};

it('standard converts recursive objects and arrays to Camel', () => {
  const actual = standard.objectToCamel(input);
  const expected = {
    'hTTPServer': {
      apiVersion: [{ aB: 'value', trailing: 3 }],
      dateValue: date,
      byteValue: bytes,
      nullValue: null,
      undefinedValue: undefined,
      primitiveValues: [1, 'do_not_convert', true, null, undefined],
    },
    '-1': 'negative',
    '+1.25': 'decimal',
    '42': 'numeric',
  };
  const sameType: Equal<typeof actual, typeof expected> = true;
  expect(sameType).toBe(true);
  expect(actual).toEqual(expected);
  expect(actual.hTTPServer.dateValue).toBe(date);
  expect(actual.hTTPServer.byteValue).toBe(bytes);
  const array = standard.objectToCamel([input]);
  const sameArrayType: Equal<typeof array, (typeof expected)[]> = true;
  expect(sameArrayType).toBe(true);
  expect(array).toEqual([expected]);
});

it('standard converts recursive objects and arrays to Pascal', () => {
  const actual = standard.objectToPascal(input);
  const expected = {
    'HTTPServer': {
      ApiVersion: [{ AB: 'value', Trailing: 3 }],
      DateValue: date,
      ByteValue: bytes,
      NullValue: null,
      UndefinedValue: undefined,
      PrimitiveValues: [1, 'do_not_convert', true, null, undefined],
    },
    '-1': 'negative',
    '+1.25': 'decimal',
    '42': 'numeric',
  };
  const sameType: Equal<typeof actual, typeof expected> = true;
  expect(sameType).toBe(true);
  expect(actual).toEqual(expected);
  expect(actual.HTTPServer.DateValue).toBe(date);
  expect(actual.HTTPServer.ByteValue).toBe(bytes);
  const array = standard.objectToPascal([input]);
  const sameArrayType: Equal<typeof array, (typeof expected)[]> = true;
  expect(sameArrayType).toBe(true);
  expect(array).toEqual([expected]);
});

it('standard converts recursive objects and arrays to Snake', () => {
  const actual = standard.objectToSnake(input);
  const expected = {
    'h_t_t_p_server': {
      api_version: [{ a_b: 'value', trailing: 3 }],
      date_value: date,
      byte_value: bytes,
      null_value: null,
      undefined_value: undefined,
      primitive_values: [1, 'do_not_convert', true, null, undefined],
    },
    '-1': 'negative',
    '+1.25': 'decimal',
    '42': 'numeric',
  };
  const sameType: Equal<typeof actual, typeof expected> = true;
  expect(sameType).toBe(true);
  expect(actual).toEqual(expected);
  expect(actual.h_t_t_p_server.date_value).toBe(date);
  expect(actual.h_t_t_p_server.byte_value).toBe(bytes);
  const array = standard.objectToSnake([input]);
  const sameArrayType: Equal<typeof array, (typeof expected)[]> = true;
  expect(sameArrayType).toBe(true);
  expect(array).toEqual([expected]);
});

it('standard converts recursive objects and arrays to ScreamingSnake', () => {
  const actual = standard.objectToScreamingSnake(input);
  const expected = {
    'H_T_T_P_SERVER': {
      API_VERSION: [{ A_B: 'value', TRAILING: 3 }],
      DATE_VALUE: date,
      BYTE_VALUE: bytes,
      NULL_VALUE: null,
      UNDEFINED_VALUE: undefined,
      PRIMITIVE_VALUES: [1, 'do_not_convert', true, null, undefined],
    },
    '-1': 'negative',
    '+1.25': 'decimal',
    '42': 'numeric',
  };
  const sameType: Equal<typeof actual, typeof expected> = true;
  expect(sameType).toBe(true);
  expect(actual).toEqual(expected);
  expect(actual.H_T_T_P_SERVER.DATE_VALUE).toBe(date);
  expect(actual.H_T_T_P_SERVER.BYTE_VALUE).toBe(bytes);
  const array = standard.objectToScreamingSnake([input]);
  const sameArrayType: Equal<typeof array, (typeof expected)[]> = true;
  expect(sameArrayType).toBe(true);
  expect(array).toEqual([expected]);
});

it('noSplitNumbers converts recursive objects and arrays to Camel', () => {
  const actual = noSplitNumbers.objectToCamel(input);
  const expected = {
    'hTTPServer': {
      apiVersion: [{ aB: 'value', trailing: 3 }],
      dateValue: date,
      byteValue: bytes,
      nullValue: null,
      undefinedValue: undefined,
      primitiveValues: [1, 'do_not_convert', true, null, undefined],
    },
    '-1': 'negative',
    '+1.25': 'decimal',
    '42': 'numeric',
  };
  const sameType: Equal<typeof actual, typeof expected> = true;
  expect(sameType).toBe(true);
  expect(actual).toEqual(expected);
  expect(actual.hTTPServer.dateValue).toBe(date);
  expect(actual.hTTPServer.byteValue).toBe(bytes);
  const array = noSplitNumbers.objectToCamel([input]);
  const sameArrayType: Equal<typeof array, (typeof expected)[]> = true;
  expect(sameArrayType).toBe(true);
  expect(array).toEqual([expected]);
});

it('noSplitNumbers converts recursive objects and arrays to Pascal', () => {
  const actual = noSplitNumbers.objectToPascal(input);
  const expected = {
    'HTTPServer': {
      ApiVersion: [{ AB: 'value', Trailing: 3 }],
      DateValue: date,
      ByteValue: bytes,
      NullValue: null,
      UndefinedValue: undefined,
      PrimitiveValues: [1, 'do_not_convert', true, null, undefined],
    },
    '-1': 'negative',
    '+1.25': 'decimal',
    '42': 'numeric',
  };
  const sameType: Equal<typeof actual, typeof expected> = true;
  expect(sameType).toBe(true);
  expect(actual).toEqual(expected);
  expect(actual.HTTPServer.DateValue).toBe(date);
  expect(actual.HTTPServer.ByteValue).toBe(bytes);
  const array = noSplitNumbers.objectToPascal([input]);
  const sameArrayType: Equal<typeof array, (typeof expected)[]> = true;
  expect(sameArrayType).toBe(true);
  expect(array).toEqual([expected]);
});

it('noSplitNumbers converts recursive objects and arrays to Snake', () => {
  const actual = noSplitNumbers.objectToSnake(input);
  const expected = {
    'h_t_t_p_server': {
      api_version: [{ a_b: 'value', trailing: 3 }],
      date_value: date,
      byte_value: bytes,
      null_value: null,
      undefined_value: undefined,
      primitive_values: [1, 'do_not_convert', true, null, undefined],
    },
    '-1': 'negative',
    '+1.25': 'decimal',
    '42': 'numeric',
  };
  const sameType: Equal<typeof actual, typeof expected> = true;
  expect(sameType).toBe(true);
  expect(actual).toEqual(expected);
  expect(actual.h_t_t_p_server.date_value).toBe(date);
  expect(actual.h_t_t_p_server.byte_value).toBe(bytes);
  const array = noSplitNumbers.objectToSnake([input]);
  const sameArrayType: Equal<typeof array, (typeof expected)[]> = true;
  expect(sameArrayType).toBe(true);
  expect(array).toEqual([expected]);
});

it('noSplitNumbers converts recursive objects and arrays to ScreamingSnake', () => {
  const actual = noSplitNumbers.objectToScreamingSnake(input);
  const expected = {
    'H_T_T_P_SERVER': {
      API_VERSION: [{ A_B: 'value', TRAILING: 3 }],
      DATE_VALUE: date,
      BYTE_VALUE: bytes,
      NULL_VALUE: null,
      UNDEFINED_VALUE: undefined,
      PRIMITIVE_VALUES: [1, 'do_not_convert', true, null, undefined],
    },
    '-1': 'negative',
    '+1.25': 'decimal',
    '42': 'numeric',
  };
  const sameType: Equal<typeof actual, typeof expected> = true;
  expect(sameType).toBe(true);
  expect(actual).toEqual(expected);
  expect(actual.H_T_T_P_SERVER.DATE_VALUE).toBe(date);
  expect(actual.H_T_T_P_SERVER.BYTE_VALUE).toBe(bytes);
  const array = noSplitNumbers.objectToScreamingSnake([input]);
  const sameArrayType: Equal<typeof array, (typeof expected)[]> = true;
  expect(sameArrayType).toBe(true);
  expect(array).toEqual([expected]);
});


it('preserves numeric literal keys in values and declared output types', () => {
  const numericInput = { 42: 'integer', [-1.25]: 'decimal' };
  const expected = { '42': 'integer', '-1.25': 'decimal' };
  const camel = standard.objectToCamel(numericInput);
  const pascal = standard.objectToPascal(numericInput);
  const snake = standard.objectToSnake(numericInput);
  const screaming = standard.objectToScreamingSnake(numericInput);
  const alternateCamel = noSplitNumbers.objectToCamel(numericInput);
  const alternatePascal = noSplitNumbers.objectToPascal(numericInput);
  const alternateSnake = noSplitNumbers.objectToSnake(numericInput);
  const alternateScreaming = noSplitNumbers.objectToScreamingSnake(numericInput);
  const sameTypes: [
    Equal<typeof camel, typeof expected>,
    Equal<typeof pascal, typeof expected>,
    Equal<typeof snake, typeof expected>,
    Equal<typeof screaming, typeof expected>,
    Equal<typeof alternateCamel, typeof expected>,
    Equal<typeof alternatePascal, typeof expected>,
    Equal<typeof alternateSnake, typeof expected>,
    Equal<typeof alternateScreaming, typeof expected>,
  ] = [true, true, true, true, true, true, true, true];
  expect(sameTypes.every(Boolean)).toBe(true);
  for (const actual of [camel, pascal, snake, screaming,
    alternateCamel, alternatePascal, alternateSnake, alternateScreaming]) {
    expect(actual).toEqual(expected);
    expect(actual[42]).toBe('integer');
    expect(actual['-1.25']).toBe('decimal');
  }

  const record: Record<number, string> = { 42: 'integer' };
  const converted = standard.objectToCamel(record);
  const value: string = converted['42'];
  expect(value).toBe('integer');
});

it('converts scientific-notation numeric keys through the string rules', () => {
  const scientific = { [1e-7]: 'value' };
  const camel = standard.objectToCamel(scientific);
  const pascal = standard.objectToPascal(scientific);
  const snake = standard.objectToSnake(scientific);
  const screaming = standard.objectToScreamingSnake(scientific);
  const alternateSnake = noSplitNumbers.objectToSnake(scientific);
  const alternateScreaming = noSplitNumbers.objectToScreamingSnake(scientific);
  const values: string[] = [camel['1e7'], pascal['1e7'], snake['1e_7'], screaming['1E_7'],
    alternateSnake['1e_7'], alternateScreaming['1E_7']];
  expect(values).toEqual(Array(6).fill('value'));
  expect(camel).toEqual({ '1e7': 'value' });
  expect(pascal).toEqual({ '1e7': 'value' });
  expect(snake).toEqual({ '1e_7': 'value' });
  expect(screaming).toEqual({ '1E_7': 'value' });
  expect(alternateSnake).toEqual({ '1e_7': 'value' });
  expect(alternateScreaming).toEqual({ '1E_7': 'value' });
});
