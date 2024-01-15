import {
  ObjectToCamel,
  ObjectToPascal,
  ObjectToSnake,
  objectToCamel,
  objectToSnake,
} from '../src/caseConvert';

describe('bug fixes', () => {
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
    console.log(convertedSnakeObj.array);
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
