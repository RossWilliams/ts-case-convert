import {
  ObjectToCamel,
  ObjectToPascal,
  ObjectToSnake,
  ToSnake,
  objectToCamel,
  objectToPascal,
  objectToScreamingSnake,
  objectToSnake,
} from '../src/caseConvert';

type NotAny<T> = T[] extends true[] ? T : T[] extends false[] ? T : never;
type AssertEqual<T, Expected> = NotAny<
  T extends Expected ? (Expected extends T ? true : false) : false
>;

describe('bug fixes', () => {
  it('preserves signed numeric string keys without collision', () => {
    const input = {
      '-1': 'negative one',
      '1': 'positive one',
      '0': 'zero',
    };

    expect(objectToCamel(input)).toEqual(input);
    expect(objectToSnake(input)).toEqual(input);
    expect(objectToPascal(input)).toEqual(input);
    expect(objectToScreamingSnake(input)).toEqual(input);
  });

  it('preserves required undefined property values while converting object keys', () => {
    type SnakeObject = {
      property_name: undefined;
    };
    type CamelObject = {
      propertyName: undefined;
    };

    const camelObject: ObjectToCamel<SnakeObject> = {
      propertyName: undefined,
    };
    const expectedCamelObject: CamelObject = camelObject;

    expect(expectedCamelObject.propertyName).toBeUndefined();
  });

  it('#81 - preserves primitive union array item types while converting object keys', () => {
    type SnakeObject = {
      prop_name: ('a' | 'b' | 'c')[];
    };
    type CamelObject = {
      propName: ('a' | 'b' | 'c')[];
    };

    const snakeAssignedToCamelType: ObjectToCamel<SnakeObject> = {
      propName: ['a', 'b', 'c'],
    };
    const camelObject: CamelObject = objectToCamel({
      prop_name: ['a', 'b', 'c'],
    } as SnakeObject);

    expect(snakeAssignedToCamelType.propName).toEqual(['a', 'b', 'c']);
    expect(camelObject.propName).toEqual(['a', 'b', 'c']);
  });

  it('#86 - objectToSnake round trips numeric snake case words after objectToCamel', () => {
    const snakeObject = { s3_id: 'id' };
    const roundTripped = objectToSnake(objectToCamel(snakeObject));

    expect(roundTripped).toEqual(snakeObject);
    expect(roundTripped.s3_id).toEqual('id');
  });

  it('#86 - objectToSnake round trips multi-digit numeric snake case words after objectToCamel', () => {
    const snakeObject = {
      a23_request: null,
      http2_status: 'ok',
      nested: {
        api10_response: 'ready',
      },
    };
    const roundTripped = objectToSnake(objectToCamel(snakeObject));

    expect(roundTripped).toEqual(snakeObject);
    expect(roundTripped.a23_request).toBeNull();
    expect(roundTripped.http2_status).toEqual('ok');
    expect(roundTripped.nested.api10_response).toEqual('ready');
  });

  it('#86 - still splits terminal number suffixes when converting to snake case', () => {
    const snakeObject = objectToSnake({
      myItem1: 'value',
      nestedItem: {
        nextValue23: 'nested',
      },
    });

    expect(snakeObject).toEqual({
      my_item_1: 'value',
      nested_item: {
        next_value_23: 'nested',
      },
    });
  });

  it('#50 - Does not handle an array of objects correctly', () => {
    interface MyObject {
      index: number;
      value?: string;
    }

    interface MyObjectWithArray {
      object_array: MyObject[];
    }

    type CamelCaseConvertedObjectWithArray = ObjectToCamel<MyObjectWithArray>;

    const camelRequest: CamelCaseConvertedObjectWithArray = {
      objectArray: [
        {
          index: 0,
          value: 'abc',
        },
      ],
    };

    expect(camelRequest.objectArray?.length).toEqual(1);

    camelRequest.objectArray?.forEach((value) => {
      expect(value.index).toEqual(0);
    });

    type PascalCaseConvertedObjectWithArray = ObjectToPascal<MyObjectWithArray>;
    const pascalRequest: PascalCaseConvertedObjectWithArray = {
      ObjectArray: [
        {
          Index: 0,
          Value: 'abc',
        },
      ],
    };

    expect(pascalRequest.ObjectArray?.length).toEqual(1);

    pascalRequest.ObjectArray?.forEach((value) => {
      expect(value.Index).toEqual(0);
    });

    interface MyPascalObjectWithArray {
      ObjectArray?: {
        Index: number;
        Value?: string;
      }[];
    }

    type SnakeCaseConvertedObjectWithArray =
      ObjectToSnake<MyPascalObjectWithArray>;

    const snakeRequest: SnakeCaseConvertedObjectWithArray = {
      object_array: [
        {
          index: 0,
          value: 'abc',
        },
      ],
    };

    expect(snakeRequest.object_array?.length).toEqual(1);

    snakeRequest.object_array?.forEach((value) => {
      expect(value.index).toEqual(0);
    });
  });

  it('#52 - objectToCamel return type is a Pascal-cased array when the input is a snake-typed array', () => {
    type SnakeTyped = { key: string; another_key: string };
    type CamelType = { key: string; anotherKey: string };

    const snakeObject: SnakeTyped[] = [{ key: 'a', another_key: 'b' }];

    const camelObject: CamelType[] = objectToCamel(snakeObject);

    expect(Object.keys(camelObject[0])).toEqual(['key', 'anotherKey']);
    expect(camelObject[0].key).toEqual('a');
    expect(camelObject[0].anotherKey).toEqual('b');
  });

  it('#55 - objectToCamel return type is an array when the input is a snake-typed array', () => {
    type SnakeTyped = { key: string; another_key: string };
    type CamelType = { key: string; anotherKey: string };

    const snakeObject: SnakeTyped[] = [{ key: 'a', another_key: 'b' }];

    const camelArray: CamelType[] = objectToCamel(snakeObject);

    expect(Array.isArray(camelArray)).toBe(true);
    const camelScalarArray = objectToCamel([1]);
    expect(Array.isArray(camelScalarArray)).toBe(true);
  });

  it('#58 - does not handle Buffer objects correctly', () => {
    const snakeObject = {
      buffer_key: Buffer.from('abc'),
      nested: { more_nested: Buffer.from('abc') },
      array: [new Uint8Array(Buffer.from('abc'))],
    };
    const convertedSnakeObj = objectToCamel(snakeObject);

    expect(Buffer.isBuffer(convertedSnakeObj.bufferKey)).toBeTruthy();
    expect(Buffer.isBuffer(convertedSnakeObj.nested.moreNested)).toBeTruthy();
    expect(convertedSnakeObj.array[0] instanceof Uint8Array).toBeTruthy();

    const camelObject = {
      bufferKey: Buffer.from('abc'),
      nested: { moreNested: Buffer.from('abc') },
      array: [Buffer.from('abc')],
    };
    const convertedCamelObject = objectToSnake(camelObject);

    expect(Buffer.isBuffer(convertedCamelObject.buffer_key)).toBeTruthy();
    expect(
      Buffer.isBuffer(convertedCamelObject.nested.more_nested),
    ).toBeTruthy();
    expect(Buffer.isBuffer(convertedCamelObject.array[0])).toBeTruthy();
  });

  it('#78 - does not handle date objects correctly', () => {
    const snakeObject = {
      date_key: new Date(),
      nested: { more_nested: new Date() },
      array: [new Date()],
    };
    const convertedSnakeObj = objectToCamel(snakeObject);

    expect(convertedSnakeObj.dateKey instanceof Date).toBeTruthy();
    expect(convertedSnakeObj.nested.moreNested instanceof Date).toBeTruthy();
    expect(convertedSnakeObj.array[0] instanceof Date).toBeTruthy();
  });

  it('#64 - camel to snake missing property name ending in a number', () => {
    const camelObject = {
      aaaBbb1: 'a',
    };
    const snakeObject = objectToSnake(camelObject);
    expect(snakeObject.aaa_bbb_1).toEqual('a');
    expect(Object.keys(snakeObject)).toHaveLength(1);
  });
});

// Bug #50
interface ArrayTypes {
  arrayOfString: string[];
  optionalArrayOfString?: string[];
  arrayOfArrayOfString: string[][];
  optionalArrayOfArrayofString1?: string[][];
  arrayOfOptionalArrayOfString: Array<string[] | undefined>;
}

type SnakeArrayTypes = ObjectToSnake<ArrayTypes>;

const _snakeArrays1: SnakeArrayTypes = {
  array_of_string: ['a'],
  array_of_array_of_string: [['a']],
  array_of_optional_array_of_string: [['a']],
  optional_array_of_string: ['a'],
};

const _snakeArrays2: SnakeArrayTypes = {
  array_of_string: ['a'],
  array_of_array_of_string: [['a']],
  array_of_optional_array_of_string: [undefined],
  optional_array_of_string: undefined,
};

const _camelArrays1: ObjectToCamel<ArrayTypes> = {
  arrayOfString: ['a'],
  arrayOfArrayOfString: [['a']],
  arrayOfOptionalArrayOfString: [['a']],
  optionalArrayOfString: ['a'],
};

const _camelArrays2: ObjectToCamel<ArrayTypes> = {
  arrayOfString: ['a'],
  arrayOfArrayOfString: [['a']],
  arrayOfOptionalArrayOfString: [undefined],
  optionalArrayOfString: undefined,
};

// Bug #78
const _camelDate: ObjectToCamel<{
  my_date: Date;
  arr_date: [Date];
  nested: { inner_date: Date };
}> = {
  myDate: new Date(),
  arrDate: [new Date()],
  nested: { innerDate: new Date() },
};

const _snakeDate: ObjectToSnake<{
  myDate: Date;
  arrDate: [Date];
  nested: { innerDate: Date };
}> = {
  my_date: new Date(),
  arr_date: [new Date()],
  nested: { inner_date: new Date() },
};

const _pascalDate: ObjectToPascal<{
  myDate: Date;
  arrDate: [Date];
  nested: { innerDate: Date };
}> = {
  MyDate: new Date(),
  ArrDate: [new Date()],
  Nested: { InnerDate: new Date() },
};

type _multiDigitSnakeWord = AssertEqual<ToSnake<'a23Request'>, 'a23_request'>;
const _multiDigitSnakeWordCheck: _multiDigitSnakeWord = true;

type _multiDigitMiddleSnakeWord = AssertEqual<
  ToSnake<'api10Response'>,
  'api10_response'
>;
const _multiDigitMiddleSnakeWordCheck: _multiDigitMiddleSnakeWord = true;

type _singleDigitMiddleSnakeWord = AssertEqual<ToSnake<'http2Status'>, 'http2_status'>;
const _singleDigitMiddleSnakeWordCheck: _singleDigitMiddleSnakeWord = true;

type _terminalNumberSuffix = AssertEqual<ToSnake<'nextValue23'>, 'next_value_23'>;
const _terminalNumberSuffixCheck: _terminalNumberSuffix = true;
