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

  it('keeps the same names for string converters', () => {
    expect(toSnake('myItem1')).toEqual('my_item1');
    expect(toScreamingSnake('myItem1')).toEqual('MY_ITEM1');
  });
});

type T1 = ToSnake<'myItem1'>;
const _s1: AssertEqual<T1, 'my_item1'> = true;

type TS1 = ToScreamingSnake<'myItem1'>;
const _ss1: AssertEqual<TS1, 'MY_ITEM1'> = true;

type O1 = ObjectToSnake<{
  myItem1: string;
  nestedItem: {
    nextValue2: string;
  };
}>;
const _o1: AssertEqual<
  O1,
  {
    my_item1: string;
    nested_item: {
      next_value2: string;
    };
  }
> = true;

type OS1 = ObjectToScreamingSnake<{
  myItem1: string;
}>;
const _os1: AssertEqual<
  OS1,
  {
    MY_ITEM1: string;
  }
> = true;
