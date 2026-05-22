<h1 align="center">ts-case-convert</h1>
<p>
  <a href="https://codecov.io/gh/RossWilliams/ts-case-convert">
    <img src="https://codecov.io/gh/RossWilliams/ts-case-convert/branch/main/graph/badge.svg?token=LO2GB8K44W"/>
  </a>
  <a href="https://badge.fury.io/js/ts-case-convert"><img src="https://badge.fury.io/js/ts-case-convert.svg" alt="npm version" height="18"></a>
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/ts-case-convert?style=flat">
  <img alt="npm type definitions" src="https://img.shields.io/npm/types/ts-case-convert?style=flat">
  <img alt="GitHub package.json dependency version (dev dep on branch)" src="https://img.shields.io/github/package-json/dependency-version/rosswilliams/ts-case-convert/dev/typescript">
  <a href="https://github.com/RossWilliams/ts-case-convert#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/RossWilliams/ts-case-convert/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/RossWilliams/ts-case-convert/blob/master/LICENSE" target="_blank">
    <img alt="License: Apache--2.0" src="https://img.shields.io/github/license/RossWilliams/ts-case-convert" />
  </a>
</p>

ts-case-convert is a zero dependency implementation for converting object keys between camelCase, snake_case, PascalCase, and SCREAMING_SNAKE_CASE while preserving TypeScript type information, code completion, and type validation. See tests for detailed conversion tests.

## Usage

```typescript
const camel = objectToCamel({
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

type CheckCamel = typeof camel.anArrayOfObjects[0]['aB']; // -> 'string'
const ab: CheckCamel = camel.anArrayOfObjects[0]['aB']; // -> valid
console.log(camel.anArrayOfObjects.aB); // -> 'ab'

const snake = objectToSnake({
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

type CheckSnake = typeof snake.an_array_of_objects[0]['a_b']; // -> 'string'
const ab: CheckSnake = snake.an_array_of_objects[0]['a_b']; // -> valid
console.log(snake.an_array_of_objects.a_b); // -> 'ab'

const screamingSnake = objectToScreamingSnake({
  helloWorld: 'helloWorld',
  s3Id: 'id',
  nestedObject: {
    apiVersion: 'v1',
  },
});

type CheckScreamingSnake = typeof screamingSnake.NESTED_OBJECT.API_VERSION; // -> 'string'
console.log(screamingSnake.S3_ID); // -> 'id'
```

## No Number Splitting

The default snake case conversion splits lowercase letters from following numbers:

```typescript
import { toSnake } from 'ts-case-convert';

console.log(toSnake('myItem1')); // -> 'my_item_1'
```

Use the `no-split-numbers` import path when numbers should stay attached to the preceding word. It exports the same runtime function and type names as the default entry point.

```typescript
import {
  objectToScreamingSnake,
  objectToSnake,
  toScreamingSnake,
  toSnake,
} from 'ts-case-convert/no-split-numbers';

console.log(toSnake('myItem1')); // -> 'my_item1'
console.log(toScreamingSnake('myItem1')); // -> 'MY_ITEM1'

const output = objectToSnake({
  myItem1: 'value',
  nestedObject: {
    apiVersion2: 'v2',
  },
});

console.log(output.my_item1); // -> 'value'

const screaming = objectToScreamingSnake({
  myItem1: 'value',
});

console.log(screaming.MY_ITEM1); // -> 'value'
```

## Run tests

```sh
pnpm run test
```

## Documentation

See [tests](./test/caseConvert.test.ts), [bug regression tests](./test/caseConvert.bugs.test.ts), and [no-split-numbers tests](./test/no-split-numbers.test.ts).

## 📝 License

Copyright © 2021 [Ross Williams](https://github.com/RossWilliams).<br />
This project is [Apache--2.0](https://github.com/RossWilliams/ts-case-convert/blob/master/LICENSE) licensed.
