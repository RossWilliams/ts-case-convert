function convertObject<TInput extends object, TResult>(
  obj: TInput,
  keyConverter: (arg: string) => string,
): TResult {
  if (obj === null || typeof obj === 'undefined' || typeof obj !== 'object') {
    return obj as unknown as TResult;
  }

  const out = (Array.isArray(obj) ? [] : {}) as TResult;
  for (const [k, v] of Object.entries(obj)) {

    // @ts-ignore

    out[keyConverter(k)] = Array.isArray(v)
      ? (v.map(<ArrayItem extends object>(item: ArrayItem) =>
          typeof item === 'object' &&
          !(item instanceof Uint8Array) &&
          !(item instanceof Date)
            ? convertObject<
                ArrayItem,
                TResult extends ObjectToCamel<TInput>
                  ? ObjectToCamel<ArrayItem>
                  : TResult extends ObjectToPascal<TInput>
                  ? ObjectToPascal<ArrayItem>
                  : TResult extends ObjectToScreamingSnake<TInput>
                  ? ObjectToScreamingSnake<ArrayItem>
                  : ObjectToSnake<ArrayItem>
              >(item, keyConverter)
            : item,
        ) as unknown[])
      : v instanceof Uint8Array || v instanceof Date
      ? v
      : typeof v === 'object'
      ? convertObject<
          typeof v,
          TResult extends ObjectToCamel<TInput>
            ? ObjectToCamel<typeof v>
            : TResult extends ObjectToPascal<TInput>
            ? ObjectToPascal<typeof v>
            : TResult extends ObjectToScreamingSnake<TInput>
            ? ObjectToScreamingSnake<typeof v>
            : ObjectToSnake<typeof v>
        >(v, keyConverter)
      : (v as unknown);
  }
  return out;
}

export function toCamel<T extends string>(term: T): ToCamel<T> {
  if (isNumericKey(term)) {
    return term as ToCamel<T>;
  }

  return (
    term.length === 1
      ? term.toLowerCase()
      : term
          .replace(/^([A-Z])/, (m) => m[0].toLowerCase())
          .replace(/[_-]([a-z0-9])/g, (m) => m[1].toUpperCase())
  ) as ToCamel<T>;
}

export function objectToCamel<T extends object>(obj: T): ObjectToCamel<T> {
  return convertObject(obj, toCamel);
}

function toSnakeWithSplitNumbers<
  T extends string,
  SplitNumbers extends boolean,
>(term: T, splitNumbers: SplitNumbers): ToSnake<T, SplitNumbers> {
  if (isNumericKey(term)) {
    return term as ToSnake<T, SplitNumbers>;
  }

  let result: string = term;
  let circuitBreaker = 0;

  if (splitNumbers) {
    while (
      (/([a-z])([0-9])(?![A-Z][a-z])/.exec(result)?.length || 0) > 2 &&
      circuitBreaker < 10
    ) {
      result = result.replace(
        /([a-z])([0-9])(?![A-Z][a-z])/,
        (_all, $1: string, $2: string) =>
          `${$1.toLowerCase()}_${$2.toLowerCase()}`,
      );

      circuitBreaker += 1;
    }
  }

  while (
    (/(.+?)([A-Z])/.exec(result)?.length || 0) > 2 &&
    circuitBreaker < 10
  ) {
    result = result.replace(
      /(.+?)([A-Z])/,
      (_all, $1: string, $2: string) =>
        `${$1.toLowerCase()}_${$2.toLowerCase()}`,
    );
    circuitBreaker += 1;
  }

  return result.toLowerCase() as ToSnake<T, SplitNumbers>;
}

export function toSnake<T extends string>(term: T): ToSnake<T> {
  return toSnakeWithSplitNumbers(term, true);
}

export function toSnakeNoSplitNumbers<T extends string>(
  term: T,
): ToSnake<T, false> {
  return toSnakeWithSplitNumbers(term, false);
}

export function objectToSnake<T extends object>(obj: T): ObjectToSnake<T> {
  return convertObject(obj, toSnake);
}

export function objectToSnakeNoSplitNumbers<T extends object>(
  obj: T,
): ObjectToSnake<T, false> {
  return convertObject(obj, toSnakeNoSplitNumbers);
}

export function toScreamingSnake<T extends string>(
  term: T,
): ToScreamingSnake<T> {
  return toSnake(term).toUpperCase() as ToScreamingSnake<T>;
}

export function toScreamingSnakeNoSplitNumbers<T extends string>(
  term: T,
): ToScreamingSnake<T, false> {
  return toSnakeNoSplitNumbers(term).toUpperCase() as ToScreamingSnake<T, false>;
}

export function objectToScreamingSnake<T extends object>(
  obj: T,
): ObjectToScreamingSnake<T> {
  return convertObject(obj, toScreamingSnake);
}

export function objectToScreamingSnakeNoSplitNumbers<T extends object>(
  obj: T,
): ObjectToScreamingSnake<T, false> {
  return convertObject(obj, toScreamingSnakeNoSplitNumbers);
}

export function toPascal<T extends string>(term: T): ToPascal<T> {
  if (isNumericKey(term)) {
    return term as ToPascal<T>;
  }

  return toCamel(term).replace(/^([a-z])/, (m) =>
    m[0].toUpperCase(),
  ) as ToPascal<T>;
}

export function objectToPascal<T extends object>(obj: T): ObjectToPascal<T> {
  return convertObject(obj, toPascal);
}

export type ToCamel<S extends string | number | symbol> = S extends string
  ? S extends NumericKey
    ? S
    : S extends `${infer Head}_${infer Tail}`
    ? `${ToCamel<Uncapitalize<Head>>}${Capitalize<ToCamel<Tail>>}`
    : S extends `${infer Head}-${infer Tail}`
    ? `${ToCamel<Uncapitalize<Head>>}${Capitalize<ToCamel<Tail>>}`
    : Uncapitalize<S>
  : never;

export type ObjectToCamel<T extends object | undefined | null> =
  T extends undefined
    ? undefined
    : T extends null
    ? null
    : T extends Array<infer ArrayType>
    ? Array<ConvertArrayItem<ArrayType, 'camel'>>
    : T extends Uint8Array
    ? Uint8Array
    : T extends Date
    ? Date
    : {
        [K in keyof T as ToCamel<K>]: ConvertObjectValue<T[K], 'camel'>;
      };

export type ToPascal<S extends string | number | symbol> = S extends string
  ? S extends NumericKey
    ? S
    : S extends `${infer Head}_${infer Tail}`
    ? `${Capitalize<ToCamel<Head>>}${Capitalize<ToCamel<Tail>>}`
    : S extends `${infer Head}-${infer Tail}`
    ? `${Capitalize<ToCamel<Head>>}${Capitalize<ToCamel<Tail>>}`
    : Capitalize<S>
  : never;

export type ObjectToPascal<T extends object | undefined | null> =
  T extends undefined
    ? undefined
    : T extends null
    ? null
    : T extends Array<infer ArrayType>
    ? Array<ConvertArrayItem<ArrayType, 'pascal'>>
    : T extends Uint8Array
    ? Uint8Array
    : T extends Date
    ? Date
    : {
        [K in keyof T as ToPascal<K>]: ConvertObjectValue<T[K], 'pascal'>;
      };

export type ToSnake<
  S extends string | number | symbol,
  SplitNumbers extends boolean = true,
> = S extends string
  ? S extends NumericKey
    ? S
    : S extends `${infer Head}${CapitalChars}${infer Tail}` // string has a capital char somewhere
    ? Head extends '' // there is a capital char in the first position
      ? Tail extends ''
        ? Lowercase<S> /*  'A' */
        : S extends `${infer Caps}${Tail}` // tail exists, has capital characters
        ? Caps extends CapitalChars
          ? Tail extends CapitalLetters
            ? `${Lowercase<Caps>}_${Lowercase<Tail>}` /* 'AB' */
            : Tail extends `${CapitalLetters}${string}`
            ? `${ToSnake<Caps>}_${ToSnake<Tail>}` /* first tail char is upper? 'ABcd' */
            : `${ToSnake<Caps>}${ToSnake<Tail>}` /* 'AbCD','AbcD',  */ /* TODO: if tail is only numbers, append without underscore */
          : never /* never reached, used for inference of caps */
        : never
      : Tail extends '' /* 'aB' 'abCD' 'ABCD' 'AB' */
      ? S extends `${Head}${infer Caps}`
        ? Caps extends CapitalChars
          ? Head extends Lowercase<Head> /* 'abcD' */
            ? Caps extends Numbers
              ? // Head exists and is lowercase, tail does not, Caps is a number, we may be in a sub-select
                // if head ends with number, don't split head an Caps, keep contiguous numbers together
                SplitNumbers extends false
                ? `${ToSnake<Head, SplitNumbers>}${Caps}`
                : Head extends `${string}${Numbers}`
                ? never
                : // head does not end in number, safe to split. 'abc2' -> 'abc_2'
                  `${ToSnake<Head, SplitNumbers>}_${Caps}`
              : `${ToSnake<Head, SplitNumbers>}_${ToSnake<
                  Caps,
                  SplitNumbers
                >}` /* 'abcD' 'abc25' */
            : never /* stop union type forming */
          : never
        : never /* never reached, used for inference of caps */
      : S extends `${Head}${infer Caps}${Tail}` /* 'abCd' 'ABCD' 'AbCd' 'ABcD' */
      ? Caps extends CapitalChars
        ? Head extends Lowercase<Head> /* is 'abCd' 'abCD' ? */
          ? Tail extends CapitalLetters /* is 'abCD' where Caps = 'C' */
            ? `${ToSnake<Head, SplitNumbers>}_${ToSnake<
                Caps,
                SplitNumbers
              >}_${Lowercase<Tail>}` /* aBCD Tail = 'D', Head = 'aB' */
            : Tail extends `${CapitalLetters}${string}` /* is 'aBCd' where Caps = 'B' */
            ? Caps extends Numbers
              ? `${ToSnake<Head, SplitNumbers>}${Caps}_${ToSnake<
                  Tail,
                  SplitNumbers
                >}` /* 's3Id' => 's3_id' */
              : Head extends Numbers
              ? never /* stop union type forming */
              : Head extends `${string}${Numbers}`
              ? never /* stop union type forming */
              : `${Head}_${ToSnake<Caps, SplitNumbers>}_${ToSnake<
                  Tail,
                  SplitNumbers
                >}` /* 'aBCd' => `${'a'}_${Lowercase<'B'>}_${ToSnake<'Cd'>}` */
            : Tail extends `${LowercaseLetters}${string}`
            ? Head extends `${string}${Numbers}`
              ? `${Head}_${Lowercase<Caps>}${ToSnake<
                  Tail,
                  SplitNumbers
                >}` /* 's3Id' => 's3_id' */
              : `${ToSnake<Head, SplitNumbers>}_${Lowercase<Caps>}${ToSnake<
                  Tail,
                  SplitNumbers
                >}` /* 'aBcD' where Caps = 'B' tail starts as lowercase */
            : `${ToSnake<Head, SplitNumbers>}_${Lowercase<Caps>}${ToSnake<
                Tail,
                SplitNumbers
              >}` /* 'aBcD' where Caps = 'B' tail starts as lowercase */
          : never
        : never
      : never
    : S /* 'abc'  */
  : never;

export type ObjectToSnake<
  T extends object | undefined | null,
  SplitNumbers extends boolean = true,
> =
  T extends undefined
    ? undefined
    : T extends null
    ? null
    : T extends Array<infer ArrayType>
    ? Array<ConvertArrayItem<ArrayType, 'snake', SplitNumbers>>
    : T extends Uint8Array
    ? Uint8Array
    : T extends Date
    ? Date
    : {
        [K in keyof T as ToSnake<K, SplitNumbers>]: ConvertObjectValue<
          T[K],
          'snake',
          SplitNumbers
        >;
      };

export type ToScreamingSnake<
  S extends string | number | symbol,
  SplitNumbers extends boolean = true,
> = Uppercase<ToSnake<S, SplitNumbers>>;

export type ObjectToScreamingSnake<
  T extends object | undefined | null,
  SplitNumbers extends boolean = true,
> =
  T extends undefined
    ? undefined
    : T extends null
    ? null
    : T extends Array<infer ArrayType>
    ? Array<ConvertArrayItem<ArrayType, 'screamingSnake', SplitNumbers>>
    : T extends Uint8Array
    ? Uint8Array
    : T extends Date
    ? Date
    : {
        [K in keyof T as ToScreamingSnake<K, SplitNumbers>]: ConvertObjectValue<
          T[K],
          'screamingSnake',
          SplitNumbers
        >;
      };

type CaseMode = 'camel' | 'pascal' | 'snake' | 'screamingSnake';

type NumericKey = `${number}`;

type Convert<
  T extends object | undefined | null,
  Mode extends CaseMode,
  SplitNumbers extends boolean,
> =
  Mode extends 'camel'
    ? ObjectToCamel<T>
    : Mode extends 'pascal'
    ? ObjectToPascal<T>
    : Mode extends 'snake'
    ? ObjectToSnake<T, SplitNumbers>
    : ObjectToScreamingSnake<T, SplitNumbers>;

type ConvertArrayItem<
  T,
  Mode extends CaseMode,
  SplitNumbers extends boolean = true,
> = T extends object
  ? Convert<T, Mode, SplitNumbers>
  : T;

type ConvertObjectValue<
  T,
  Mode extends CaseMode,
  SplitNumbers extends boolean = true,
> = T extends Array<infer ArrayType>
  ? Array<ConvertArrayItem<ArrayType, Mode, SplitNumbers>>
  : T extends object | undefined | null
  ? Convert<T, Mode, SplitNumbers>
  : T;

function isNumericKey(term: string): boolean {
  return /^-?\d+(?:\.\d+)?$/.test(term);
}

type CapitalLetters =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

type LowercaseLetters =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

type Numbers = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type CapitalChars = CapitalLetters | Numbers;
