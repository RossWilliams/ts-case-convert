import {
  objectToCamel,
  objectToSnake,
  toSnake,
  ToCamel,
  ToSnake,
  toCamel,
} from '../src/caseStyles';

describe('Property name converter', () => {
  it('converts to camelCase', () => {
    const testToCamel = objectToCamel({
      hello_world: 'helloWorld',
      a_number: 5,
      an_array: [1, 2, 4],
      null_object: null,
      undef_object: undefined,
      an_array_of_objects: [{ a_b: 'ab', a_c: 'ac' }],
      an_object: {
        a_1: 'a1',
        a_2: 'a2',
      },
    });

    expect('helloWorld' in testToCamel).toStrictEqual(true);
    expect('hello_world' in testToCamel).not.toStrictEqual(true);
    expect(testToCamel.aNumber).toEqual(5);
    expect(testToCamel.helloWorld).toEqual('helloWorld');
    expect(testToCamel.anArray).toEqual([1, 2, 4]);
    expect(testToCamel.nullObject).toBeNull();
    expect(testToCamel.undefObject).toBeUndefined();
    expect(testToCamel.anArrayOfObjects[0].aB).toEqual('ab');
    expect(testToCamel.anArrayOfObjects[0].aC).toEqual('ac');
    expect(testToCamel.anObject.a1).toEqual('a1');
    expect(testToCamel.anObject.a2).toEqual('a2');
  });

  it('converts to snake_case', () => {
    const testToSnake = objectToSnake({
      helloWorld: 'helloWorld',
      aNumber: 5,
      anArray: [1, 2, 4],
      nullObject: null,
      undefObject: undefined,
      anArrayOfObjects: [{ aB: 'ab', aC: 'ac' }],
      anObject: {
        A1: 'a_1',
        A2: 'a_2',
      },
    });

    expect('helloWorld' in testToSnake).toStrictEqual(false);
    expect('hello_world' in testToSnake).toStrictEqual(true);
    expect(testToSnake.a_number).toEqual(5);
    expect(testToSnake.hello_world).toEqual('helloWorld');
    expect(testToSnake.an_array).toEqual([1, 2, 4]);
    expect(testToSnake.null_object).toBeNull();
    expect(testToSnake.undef_object).toBeUndefined();
    //expect(testToSnake.an_array_of_objects[0].aB).toEqual("ab");
    //expect(testToSnake.an_array_of_objects[0].aC).toEqual("ac");
    expect(testToSnake.an_object.a1).toEqual('a_1');
    expect(testToSnake.an_object.a2).toEqual('a_2');
  });
});

describe('Regular expressions', () => {
  it('converts to camelCase', () => {
    expect(toCamel('hello_world')).toEqual('helloWorld');
    expect(toCamel('the_quick_brown_fox_jumps_over_the_lazy_dog')).toEqual(
      'theQuickBrownFoxJumpsOverTheLazyDog'
    );
    expect(toCamel('abc')).toEqual('abc');
    expect(toCamel('abc')).toEqual('abc');
    expect(toCamel('a_b_c')).toEqual('aBC');
    expect(toCamel('ab_c')).toEqual('abC');
    expect(toCamel('a_b')).toEqual('aB');
    expect(toCamel('a_b')).toEqual('aB');
    expect(toCamel('abc_d')).toEqual('abcD');
    expect(toCamel('abc_d')).toEqual('abcD');
    expect(toCamel('ab_cde')).toEqual('abCde');
    expect(toCamel('abc_d_e_f')).toEqual('abcDEF');
    expect(toCamel('ab_cdef_g')).toEqual('abCdefG');
    expect(toCamel('ab_cd_e_f_gh')).toEqual('abCdEFGh');
    expect(toCamel('A')).toEqual('a');
    expect(toCamel('a1')).toEqual('a1');
    expect(toCamel('a_1')).toEqual('a1');
    expect(toCamel('a_1c_2d')).toEqual('a1c2d');
    expect(toCamel('ab_1c_2_d')).toEqual('ab1c2D');
    expect(toCamel('ab_1c_2d')).toEqual('ab1c2d');
    expect(toCamel('ab_25')).toEqual('ab25');
    expect(toCamel('abc_e25_d50')).toEqual('abcE25D50');
    expect(toCamel('abc_25_d50')).toEqual('abc25D50');
    expect(toCamel('abc_25_a50')).toEqual('abc25A50');
  });
  it('converts to snake case', () => {
    expect(toSnake('helloWorld')).toEqual('hello_world');
    expect(toSnake('theQuickBrownFoxJumpsOverTheLazyDog')).toEqual(
      'the_quick_brown_fox_jumps_over_the_lazy_dog'
    );
    expect(toSnake('Abc')).toEqual('abc');
    expect(toSnake('abc')).toEqual('abc');
    expect(toSnake('ABC')).toEqual('a_b_c');
    expect(toSnake('abC')).toEqual('ab_c');
    expect(toSnake('AB')).toEqual('a_b');
    expect(toSnake('aB')).toEqual('a_b');
    expect(toSnake('AbcD')).toEqual('abc_d');
    expect(toSnake('abcD')).toEqual('abc_d');
    expect(toSnake('abCde')).toEqual('ab_cde');
    expect(toSnake('abcDEF')).toEqual('abc_d_e_f');
    expect(toSnake('abCdefG')).toEqual('ab_cdef_g');
    expect(toSnake('AbCdEFGh')).toEqual('ab_cd_e_f_gh');
    expect(toSnake('A')).toEqual('a');
    expect(toSnake('A1')).toEqual('a1');
    expect(toSnake('a1')).toEqual('a_1');
    expect(toSnake('a1c2d')).toEqual('a_1c_2d');
    expect(toSnake('ab1c2D')).toEqual('ab_1c_2_d');
    expect(toSnake('ab1c2d')).toEqual('ab_1c_2d');
    expect(toSnake('ab25')).toEqual('ab_25');
    expect(toSnake('abcE25D50')).toEqual('abc_e25_d50');
    expect(toSnake('abc25D50')).toEqual('abc_25_d50');
    expect(toSnake('abc25A50')).toEqual('abc_25_a50');
  });
});

type NotAny<T> = T[] extends true[] ? T : T[] extends false[] ? T : never;
type AssertEqual<T, Expected> = NotAny<
  T extends Expected ? (Expected extends T ? true : false) : false
>;

type T0 = ToCamel<'hello_world'>;
const _t0: AssertEqual<T0, 'helloWorld'> = true;

type T1 = ToSnake<'helloWorld'>;
const _s1: AssertEqual<T1, 'hello_world'> = true;
type T2 = ToSnake<'theQuickBrownFoxJumpsOverTheLazyDog'>;
const _s2: AssertEqual<
  T2,
  'the_quick_brown_fox_jumps_over_the_lazy_dog'
> = true;
type T3 = ToSnake<'abc'>;
const _s3: AssertEqual<T3, 'abc'> = true;
type T4 = ToSnake<'Abc'>;
const _s4: AssertEqual<T4, 'abc'> = true;
type T5 = ToSnake<'ABC'>;
const _s5: AssertEqual<T5, 'a_b_c'> = true;
type T6 = ToSnake<'abC'>;
const _s6: AssertEqual<T6, 'ab_c'> = true;
type T7 = ToSnake<'ABc'>;
const _s7: AssertEqual<T7, 'a_bc'> = true;
type T8 = ToSnake<'AB'>;
const _s8: AssertEqual<T8, 'a_b'> = true;
type T9 = ToSnake<'aB'>;
const _s9: AssertEqual<T9, 'a_b'> = true;
type T10 = ToSnake<'AbcD'>;
const _s10: AssertEqual<T10, 'abc_d'> = true;
type T11 = ToSnake<'abcD'>;
const _s11: AssertEqual<T11, 'abc_d'> = true;
type T12 = ToSnake<'abCde'>;
const _s12: AssertEqual<T12, 'ab_cde'> = true;
type T13 = ToSnake<'abcDEF'>;
const _s13: AssertEqual<T13, 'abc_d_e_f'> = true;
type T14 = ToSnake<'abCdefG'>;
const _s14: AssertEqual<T14, 'ab_cdef_g'> = true;
type T15 = ToSnake<'AbCdEFGh'>;
const _s15: AssertEqual<T15, 'ab_cd_e_f_gh'> = true;
type T16 = ToSnake<'A'>;
const _s16: AssertEqual<T16, 'a'> = true;
type T161 = ToSnake<'A1'>;
const _s161: AssertEqual<T161, 'a1'> = true;
type T17 = ToSnake<'a1c2d'>;
const _s17: AssertEqual<T17, 'a_1c_2d'> = true;
type T18 = ToSnake<'ab1c2D'>;
const _s18: AssertEqual<T18, 'ab_1c_2_d'> = true;
type T19 = ToSnake<'ab1c2d'>;
const _s19: AssertEqual<T19, 'ab_1c_2d'> = true;
type T20 = ToSnake<'abc25'>;
const _s20: AssertEqual<T20, 'abc_25'> = true;
type T21 = ToSnake<'abcE25D50'>;
const _s21: AssertEqual<T21, 'abc_e25_d50'> = true;
type T22 = ToSnake<'abc25D50'>;
const _s22: AssertEqual<T22, 'abc_25_d50'> = true;
type T23 = ToSnake<'abc25A50'>;
const _s23: AssertEqual<T23, 'abc_25_a50'> = true;
