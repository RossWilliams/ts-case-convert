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

ts-case-convert is a zero dependency implementation for converting object keys between camelCase, snake_case, PascalCase, and SCREAMING_SNAKE_CASE, accepting upper and lower kebab-case input, while preserving TypeScript type information, code completion, and type validation. See tests for detailed conversion tests.

## Usage

```typescript
import { objectToCamel, objectToSnake, objectToScreamingSnake } from 'ts-case-convert';

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
console.log(camel.anArrayOfObjects[0].aB); // -> 'ab'

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
const snakeAB: CheckSnake = snake.an_array_of_objects[0]['a_b']; // -> valid
console.log(snake.an_array_of_objects[0].a_b); // -> 'ab'

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

## Supported input cases

The string functions `toCamel`, `toPascal`, `toSnake`, and `toScreamingSnake` convert a single name. The corresponding `objectTo…` functions convert keys recursively through objects and arrays, preserving values such as `Date` and `Uint8Array`. Both entry points export all four modes and their matching TypeScript types.

The converters recognize the input style before applying the output rules:

| Input style | Example | Camel | Pascal | Snake | Screaming snake |
| --- | --- | --- | --- | --- | --- |
| camelCase | `apiVersion` | `apiVersion` | `ApiVersion` | `api_version` | `API_VERSION` |
| PascalCase | `ApiVersion` | `apiVersion` | `ApiVersion` | `api_version` | `API_VERSION` |
| snake_case | `api_version` | `apiVersion` | `ApiVersion` | `api_version` | `API_VERSION` |
| SCREAMING_SNAKE_CASE | `API_VERSION` | `apiVersion` | `ApiVersion` | `api_version` | `API_VERSION` |
| Lower kebab | `content-type` | `contentType` | `ContentType` | `content_type` | `CONTENT_TYPE` |
| Title kebab | `Content-Type` | `contentType` | `ContentType` | `content_type` | `CONTENT_TYPE` |
| Upper kebab | `CONTENT-TYPE` | `contentType` | `ContentType` | `content_type` | `CONTENT_TYPE` |

For input without underscores or hyphens, camel and Pascal conversion change only the first character. Internal capitals remain unchanged: `AbcDEF` becomes `abcDEF` in camel case, and `abcDEF` becomes `AbcDEF` in Pascal case. This also preserves `HTTPServer` as `hTTPServer` in camel case and `ABC` as `aBC`.

For camel/Pascal input, snake conversion inserts an underscore before each capital after the first. It does not group capital runs into acronyms: `abcDEF` becomes `abc_d_e_f`, and `HTTPServer` becomes `h_t_t_p_server`. Screaming snake uses the same boundaries and uppercases the result.

For separated input, underscores and hyphens separate words, and consecutive capitals stay together. `API_VERSION` becomes `apiVersion`, `ApiVersion`, `api_version`, or `API_VERSION`. Capitalization boundaries use ASCII letters; other characters remain within the words.

```typescript
import { objectToCamel, toPascal, toSnake, type ToCamel } from 'ts-case-convert';

const output = objectToCamel({ API_VERSION: 2, 'Content-Type': 'text/plain' });
console.log(output.apiVersion); // 2; inferred as number
console.log(output.contentType); // 'text/plain'; inferred as string

type Name = ToCamel<'API_VERSION'>; // 'apiVersion'
console.log(toPascal('API_VERSION')); // 'ApiVersion'
console.log(toSnake('HTTPServer')); // 'h_t_t_p_server'
```

Signed decimal string keys such as `'-1'` and `'-12.5'` stay unchanged. Numeric object keys such as `42` become string keys such as `'42'` in both the returned value and its type. Repeated, leading, and trailing separators are not valid case styles. They are accepted without validation, and empty words are ignored: `a__b` becomes `aB`, `AB`, `a_b`, or `A_B`; `trailing_` becomes `trailing`, `Trailing`, `trailing`, or `TRAILING`. Empty strings and strings containing only separators become empty strings. The runtime result and inferred type follow the same rules.

## Awkward inputs

The converters follow spelling rules rather than guessing what an acronym means. Existing camel/Pascal capitals are preserved when changing between those two styles, and each capital starts a word when converting to snake case. These inputs can therefore give surprising results:

| Input | Camel | Pascal | Snake | Screaming snake |
| --- | --- | --- | --- | --- |
| `AbcDEF` | `abcDEF` | `AbcDEF` | `abc_d_e_f` | `ABC_D_E_F` |
| `HTTPServer` | `hTTPServer` | `HTTPServer` | `h_t_t_p_server` | `H_T_T_P_SERVER` |
| `ABC` | `aBC` | `ABC` | `a_b_c` | `A_B_C` |
| `API_VERSION` | `apiVersion` | `ApiVersion` | `api_version` | `API_VERSION` |
| `a__b` | `aB` | `AB` | `a_b` | `A_B` |
| `trailing_` | `trailing` | `Trailing` | `trailing` | `TRAILING` |
| `a1` | `a1` | `A1` | `a_1` | `A_1` |
| `A1` | `a1` | `A1` | `a1` | `A1` |

The last two rows use default number splitting, which depends on the input letter case. The `no-split-numbers` entry point produces `a1` and `A1` for both rows in snake and screaming snake output. Repeated or trailing separators are invalid case styles, but their types and runtime values still agree. Use one consistent input style when predictable word boundaries matter.

## Migrating to 3.0.0

Version 3 changes both returned keys and literal types. Update property access, serialized payloads, and integrations that rely on version 2 spellings:

| Conversion | Input | Version 2 runtime | Version 3 runtime and type |
| --- | --- | --- | --- |
| Camel | `API_VERSION` | `aPI_VERSION` | `apiVersion` |
| Pascal | `API_VERSION` | `API_VERSION` | `ApiVersion` |
| Snake | `API_VERSION` | `a_p_i__v_e_r_s_i_o_n` | `api_version` |
| Camel | `Content-Type` | `content-Type` | `contentType` |
| Snake | `content-type` | `content-type` | `content_type` |
| Camel | `a__b` | `a_B` | `aB` |
| Camel | `trailing_` | `trailing_` | `trailing` |

Separated uppercase words are normalized (`API_VERSION` becomes `apiVersion`, `ApiVersion`, `api_version`, or `API_VERSION`). Existing camel/Pascal names retain their previous conversion rules, including an underscore before each capital for snake output; standalone `ABC` becomes `aBC` in camel case and stays `ABC` in Pascal case. Every word boundary is converted; the old ten-replacement limit is removed. These changes apply to string functions, recursive object conversion, and `ts-case-convert/no-split-numbers`.

Distinct input keys can normalize to the same output key. For example, `a_b`, `a__b`, and `a-b` all become `aB` in camel case. Object conversion keeps the value of the last key visited by `Object.entries`; choose inputs without such collisions when every value must be retained.

## No Number Splitting

The default snake and screaming snake conversions split a lowercase letter from a following digit run, unless that run is followed by a capital and then a lowercase letter:

```typescript
import { toSnake } from 'ts-case-convert';

console.log(toSnake('myItem1')); // -> 'my_item_1'
console.log(toSnake('s3Id')); // -> 's3_id'
console.log(toSnake('http23Status')); // -> 'http23_status'
console.log(toSnake('A1')); // -> 'a1' (the input letter is uppercase)
```

Camel and Pascal conversion never split digit runs. Explicit word separators still apply in every mode.

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

See [tests](./test/caseConvert.test.ts), [bug regression tests](./test/caseConvert.bugs.test.ts), [no-split-numbers tests](./test/no-split-numbers.test.ts), [input case tests](./test/case-forms.test.ts), [kebab input tests](./test/kebab-case.test.ts), and [recursive conversion tests](./test/recursive-cases.test.ts).

## 📝 License

Copyright © 2021 [Ross Williams](https://github.com/RossWilliams).<br />
This project is [Apache--2.0](https://github.com/RossWilliams/ts-case-convert/blob/master/LICENSE) licensed.
