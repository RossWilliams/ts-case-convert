import {
  objectToScreamingSnake,
  objectToSnake,
  ObjectToScreamingSnake,
  ObjectToSnake,
  toScreamingSnake,
  ToScreamingSnake,
  toSnake,
  ToSnake,
} from '../src/no-split-numbers';

type NotAny<T> = T[] extends true[] ? T : T[] extends false[] ? T : never;
type AssertEqual<T, Expected> = NotAny<
  T extends Expected ? (Expected extends T ? true : false) : false
>;

describe('no-split-numbers entrypoint', () => {
  it('keeps number suffixes attached when converting to snake case', () => {
    const converted = objectToSnake({
      myItem1: 'value',
      nestedItem: {
        nextValue2: 'nested',
      },
    });

    expect(converted).toEqual({
      my_item1: 'value',
      nested_item: {
        next_value2: 'nested',
      },
    });
  });

  it('keeps multi-digit number suffixes attached when converting to snake case', () => {
    const converted = objectToSnake({
      myItem23: 'value',
      nestedItem: {
        nextValue456: 'nested',
      },
    });

    expect(converted).toEqual({
      my_item23: 'value',
      nested_item: {
        next_value456: 'nested',
      },
    });
  });

  it('keeps number runs attached before following words', () => {
    const converted = objectToSnake({
      a23Request: null,
      http2Status: 'ok',
      nestedItem: {
        api10Response: 'ready',
      },
    });

    expect(converted).toEqual({
      a23_request: null,
      http2_status: 'ok',
      nested_item: {
        api10_response: 'ready',
      },
    });
  });

  it('keeps number suffixes attached when converting to screaming snake case', () => {
    const converted = objectToScreamingSnake({
      myItem1: 'value',
      nestedItem: {
        nextValue2: 'nested',
      },
    });

    expect(converted).toEqual({
      MY_ITEM1: 'value',
      NESTED_ITEM: {
        NEXT_VALUE2: 'nested',
      },
    });
  });

  it('keeps multi-digit numbers attached when converting to screaming snake case', () => {
    const converted = objectToScreamingSnake({
      myItem23: 'value',
      http2Status: 'ok',
      nestedItem: {
        api10Response: 'ready',
      },
    });

    expect(converted).toEqual({
      MY_ITEM23: 'value',
      HTTP2_STATUS: 'ok',
      NESTED_ITEM: {
        API10_RESPONSE: 'ready',
      },
    });
  });

  it('keeps the same names for string converters', () => {
    expect(toSnake('myItem1')).toEqual('my_item1');
    expect(toSnake('myItem23')).toEqual('my_item23');
    expect(toSnake('api10Response')).toEqual('api10_response');
    expect(toScreamingSnake('myItem1')).toEqual('MY_ITEM1');
    expect(toScreamingSnake('myItem23')).toEqual('MY_ITEM23');
    expect(toScreamingSnake('api10Response')).toEqual('API10_RESPONSE');
  });
});

type T1 = ToSnake<'myItem1'>;
const _s1: AssertEqual<T1, 'my_item1'> = true;

type T2 = ToSnake<'myItem23'>;
const _s2: AssertEqual<T2, 'my_item23'> = true;

type T3 = ToSnake<'a23Request'>;
const _s3: AssertEqual<T3, 'a23_request'> = true;

type T4 = ToSnake<'api10Response'>;
const _s4: AssertEqual<T4, 'api10_response'> = true;

type TS1 = ToScreamingSnake<'myItem1'>;
const _ss1: AssertEqual<TS1, 'MY_ITEM1'> = true;

type TS2 = ToScreamingSnake<'myItem23'>;
const _ss2: AssertEqual<TS2, 'MY_ITEM23'> = true;

type TS3 = ToScreamingSnake<'api10Response'>;
const _ss3: AssertEqual<TS3, 'API10_RESPONSE'> = true;

type O1 = ObjectToSnake<{
  myItem1: string;
  myItem23: string;
  nestedItem: {
    nextValue2: string;
    api10Response: string;
  };
}>;
const _o1: AssertEqual<
  O1,
  {
    my_item1: string;
    my_item23: string;
    nested_item: {
      next_value2: string;
      api10_response: string;
    };
  }
> = true;

type OS1 = ObjectToScreamingSnake<{
  myItem1: string;
  api10Response: string;
}>;
const _os1: AssertEqual<
  OS1,
  {
    MY_ITEM1: string;
    API10_RESPONSE: string;
  }
> = true;
