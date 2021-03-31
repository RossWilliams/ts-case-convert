// eslint-disable-next-line @typescript-eslint/ban-types
function convertObject<
  TInput extends object,
  TResult extends ObjectToCamel<TInput> | ObjectToSnake<TInput>
>(obj: TInput, keyConverter: (arg: string) => string): TResult {
  if (obj === null || typeof obj === 'undefined' || typeof obj !== 'object') {
    return obj;
  }

  const out = {} as TResult;
  for (const [k, v] of Object.entries(obj)) {
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    out[keyConverter(k)] = Array.isArray(v)
      ? // eslint-disable-next-line @typescript-eslint/ban-types
        (v.map(<ArrayItem extends object>(item: ArrayItem) =>
          typeof item === 'object'
            ? convertObject<
                ArrayItem,
                TResult extends ObjectToCamel<TInput>
                  ? ObjectToCamel<ArrayItem>
                  : ObjectToSnake<ArrayItem>
              >(item, keyConverter)
            : item,
        ) as unknown[])
      : typeof v === 'object'
      ? // eslint-disable-next-line @typescript-eslint/ban-types
        convertObject<
          typeof v,
          TResult extends ObjectToCamel<TInput>
            ? ObjectToCamel<typeof v>
            : ObjectToSnake<typeof v>
        >(
          // eslint-disable-next-line @typescript-eslint/ban-types
          v,
          keyConverter,
        )
      : (v as unknown);
  }
  return out;
}

export function toCamel(term: string): string {
  return term.length === 1
    ? term.toLowerCase()
    : term.replace(/_([a-z0-9])/g, (m) => m[1].toUpperCase());
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function objectToCamel<T extends object>(obj: T): ObjectToCamel<T> {
  return convertObject(obj, toCamel);
}

export function toSnake(term: string): string {
  let result = term;
  let circuitBreaker = 0;

  while (
    (/([a-z])([0-9])/.exec(result)?.length || 0) > 2 &&
    circuitBreaker < 10
  ) {
    result = result.replace(
      /([a-z])([0-9])/,
      (_all, $1: string, $2: string) =>
        `${$1.toLowerCase()}_${$2.toLowerCase()}`,
    );

    circuitBreaker += 1;
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

  return result.toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function objectToSnake<T extends object>(obj: T): ObjectToSnake<T> {
  return convertObject(obj, toSnake);
}

export type ToCamel<S extends string | number | symbol> = S extends string
  ? S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<ToCamel<Tail>>}`
    : S
  : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export type ObjectToCamel<T extends object | undefined> = T extends undefined
  ? undefined
  : {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [K in keyof T as ToCamel<K>]: T[K] extends Array<unknown>
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          T[K] extends Array<infer ArrayType>
          ? // eslint-disable-next-line @typescript-eslint/ban-types
            ArrayType extends object
            ? Array<ObjectToCamel<ArrayType>>
            : T[K]
          : never
        : // eslint-disable-next-line @typescript-eslint/ban-types
        T[K] extends object | undefined
        ? ObjectToCamel<T[K]>
        : T[K];
    };

export type ToSnake<S extends string | number | symbol> = S extends string
  ? S extends CapitalChars
    ? Lowercase<S>
    : S extends `${infer Head}${CapitalChars}${infer Tail}`
    ? Head extends ''
      ? Tail extends Lowercase<Tail>
        ? Lowercase<S> /*'Abcdef' */
        : Tail extends ''
        ? Lowercase<S> /*  'A' */
        : S extends `${infer Caps}${Tail}` // tail exists, has capital characters
        ? Tail extends CapitalLetters
          ? `${Lowercase<Caps>}_${Lowercase<Tail>}` /* 'AB' */
          : Tail extends `${CapitalLetters}${string}`
          ? `${ToSnake<Caps>}_${ToSnake<Tail>}` /* first tail char is upper? 'ABcd' */
          : `${ToSnake<Caps>}${ToSnake<Tail>}` /* 'AbCD','AbcD',  */ /* TODO: if tail is only numbers, append without underscore*/
        : never /* never reached, used for inference of caps */
      : Tail extends '' /* 'aB' 'abCD' 'ABCD' 'AB' */
      ? S extends `${Head}${infer Caps}`
        ? Head extends Lowercase<Head> /* 'abcD' */
          ? Caps extends Numbers
            ? never /* stop union type forming */
            : `${ToSnake<Head>}_${ToSnake<Caps>}` /* 'abcD' 'abc25' */
          : never /* stop union type forming */
        : never /* never reached, used for inference of caps */
      : S extends `${Head}${infer Caps}${Tail}` /* 'abCd' 'ABCD' 'AbCd' 'ABcD' */
      ? Head extends Lowercase<Head> /* is 'abCd' 'abCD' ? */
        ? Tail extends CapitalLetters /* is 'abCD' where Caps = 'C' */
          ? `${ToSnake<Head>}_${Lowercase<Caps>}_${Lowercase<Tail>}` /* aBCD */
          : Tail extends `${CapitalLetters}${string}` /* is 'aBCd' where Caps = 'B' */
          ? Head extends Numbers
            ? never /* stop union type forming */
            : Head extends `${string}${Numbers}`
            ? never /* stop union type forming */
            : `${Head}_${Lowercase<Caps>}_${ToSnake<Tail>}` /* 'aBCd' => `${'a'}_${Lowercase<'B'>}_${ToSnake<'Cd'>}` */
          : `${ToSnake<Head>}_${Lowercase<Caps>}${ToSnake<Tail>}` /* 'aBcD' where Caps = 'B' tail starts as lowercase */
        : never
      : never
    : S /* 'abc'  */
  : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export type ObjectToSnake<T extends object | undefined> = T extends undefined
  ? undefined
  : {
      [K in keyof T as ToSnake<K>]: T[K] extends Array<unknown>
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          T[K] extends Array<infer ArrayType>
          ? // eslint-disable-next-line @typescript-eslint/ban-types
            ArrayType extends object
            ? Array<ObjectToSnake<ArrayType>>
            : T[K]
          : never
        : // eslint-disable-next-line @typescript-eslint/ban-types
        T[K] extends object | undefined
        ? ObjectToSnake<T[K]>
        : //  Exclude<T[K], undefined> extends object
          //  ? ObjectToSnake<Exclude<T[K], undefined>>
          T[K];
    };

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

type Numbers = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type CapitalChars = CapitalLetters | Numbers;
