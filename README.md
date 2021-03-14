<h1 align="center">ts-case-convert</h1>
<p>
  <a href="https://codecov.io/gh/RossWilliams/ts-case-convert">
    <img src="https://codecov.io/gh/RossWilliams/ts-case-convert/branch/main/graph/badge.svg?token=LO2GB8K44W"/>
  </a>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
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

ts-case-convert converts objects between camelCase and snake_case while preserving Typescript type information, code completion, and type validation. See tests for detailed conversion tests, including

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

type CheckSnake = typeof snake.anArrayOfObjects[0]['a_b']; // -> 'string'
const ab: CheckSnake = snake.anArrayOfObjects[0]['a_b']; // -> valid
console.log(snake.anArrayOfObjects.a_b); // -> 'ab'
```

## Run tests

```sh
yarn run test
```

## Documentation

See [tests](./test/caseStyles.test.ts).

## 📝 License

Copyright © 2021 [Ross Williams](https://github.com/RossWilliams).<br />
This project is [Apache--2.0](https://github.com/RossWilliams/ts-case-convert/blob/master/LICENSE) licensed.
