export {
  objectToCamel,
  objectToSnakeNoSplitNumbers as objectToSnake,
  objectToScreamingSnakeNoSplitNumbers as objectToScreamingSnake,
  toSnakeNoSplitNumbers as toSnake,
  toScreamingSnakeNoSplitNumbers as toScreamingSnake,
  toCamel,
  toPascal,
  objectToPascal,
} from './caseConvert';

export type {
  ObjectToCamel,
  ToCamel,
  ToPascal,
  ObjectToPascal,
} from './caseConvert';

import type {
  ObjectToScreamingSnake as DefaultObjectToScreamingSnake,
  ObjectToSnake as DefaultObjectToSnake,
  ToScreamingSnake as DefaultToScreamingSnake,
  ToSnake as DefaultToSnake,
} from './caseConvert';

export type ToSnake<S extends string | number | symbol> = DefaultToSnake<
  S,
  false
>;

export type ObjectToSnake<T extends object | undefined | null> =
  DefaultObjectToSnake<T, false>;

export type ToScreamingSnake<S extends string | number | symbol> =
  DefaultToScreamingSnake<S, false>;

export type ObjectToScreamingSnake<T extends object | undefined | null> =
  DefaultObjectToScreamingSnake<T, false>;
