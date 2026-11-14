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

// Keep these word boundaries in sync with ConvertKeyScan below.
function convertKey(term: string, mode: CaseMode, splitNumbers = false): string {
  if (isNumericKey(term)) {
    return term;
  }

  const hasSeparators = /[_-]/.test(term);
  // Existing camel/Pascal names retain every letter after the first.
  if ((mode === 'camel' || mode === 'pascal') && !hasSeparators) {
    const first = term.charAt(0);
    return (mode === 'camel' ? first.toLowerCase() : first.toUpperCase()) + term.slice(1);
  }

  let result = '';
  let wordStart = 0;
  const appendWord = (end: number): void => {
    if (end === wordStart) {
      return;
    }
    const word = term.slice(wordStart, end).toLowerCase();
    if (mode === 'snake') {
      result += `${result ? '_' : ''}${word}`;
    } else {
      result += mode === 'pascal' || result !== ''
        ? word[0].toUpperCase() + word.slice(1)
        : word;
    }
  };

  for (let index = 0; index < term.length; index += 1) {
    const current = term[index];
    const previous = term[index - 1] ?? '';
    if (current === '_' || current === '-') {
      appendWord(index);
      wordStart = index + 1;
    } else if (splitNumbers && isDigit(current)) {
      let afterNumber = index + 1;
      while (afterNumber < term.length && isDigit(term[afterNumber])) {
        afterNumber += 1;
      }
      if (isLowercase(previous) &&
          !(isUppercase(term[afterNumber] ?? '') && isLowercase(term[afterNumber + 1] ?? ''))) {
        appendWord(index);
        wordStart = index;
      }
      index = afterNumber - 1;
    } else if (index > wordStart && isUppercase(current) &&
        (!hasSeparators || isLowercase(previous) || isDigit(previous) ||
          (isUppercase(previous) && isLowercase(term[index + 1] ?? '')))) {
      appendWord(index);
      wordStart = index;
    }
  }
  appendWord(term.length);
  return result;
}

function isLowercase(character: string): boolean {
  return character >= 'a' && character <= 'z';
}

function isUppercase(character: string): boolean {
  return character >= 'A' && character <= 'Z';
}

function isDigit(character: string): boolean {
  return character >= '0' && character <= '9';
}

export function toCamel<T extends string>(term: T): ToCamel<T> {
  return convertKey(term, 'camel') as ToCamel<T>;
}

export function objectToCamel<T extends object>(obj: T): ObjectToCamel<T> {
  return convertObject(obj, toCamel);
}

export function toSnake<T extends string>(term: T): ToSnake<T> {
  return convertKey(term, 'snake', true) as ToSnake<T>;
}

export function toSnakeNoSplitNumbers<T extends string>(
  term: T,
): ToSnake<T, false> {
  return convertKey(term, 'snake', false) as ToSnake<T, false>;
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
  return convertKey(term, 'pascal') as ToPascal<T>;
}

export function objectToPascal<T extends object>(obj: T): ObjectToPascal<T> {
  return convertObject(obj, toPascal);
}

export type ToCamel<S extends string | number | symbol> =
  ConvertKey<S, 'camel', false>;

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

export type ToPascal<S extends string | number | symbol> =
  ConvertKey<S, 'pascal', false>;

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
> = ConvertKey<S, 'snake', SplitNumbers>;

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

type ConvertKey<
  S extends string | number | symbol,
  Mode extends CaseMode,
  SplitNumbers extends boolean,
> = S extends number
  ? ConvertKey<`${S}`, Mode, SplitNumbers>
  : S extends string
  ? string extends S
    ? string
    : IsNumericKey<S> extends true
    ? S
    : S extends `${string}${'_' | '-'}${string}`
    ? ConvertKeyScan<S, Mode, SplitNumbers>
    : Mode extends 'camel'
    ? Uncapitalize<S>
    : Mode extends 'pascal'
    ? Capitalize<S>
    : ConvertKeyScan<S, Mode, SplitNumbers, true>
  : never;

// Signed decimal strings use the same grammar as isNumericKey at runtime.
type IsNumericKey<S extends string> = S extends `-${infer Unsigned}`
  ? IsDecimal<Unsigned>
  : IsDecimal<S>;

type IsDecimal<S extends string> = S extends `${infer Whole}.${infer Fraction}`
  ? IsDigits<Whole> extends true
    ? IsDigits<Fraction>
    : false
  : IsDigits<S>;

type IsDigits<S extends string> = S extends ''
  ? false
  : TakeNumberRun<S> extends [string, ''] ? true : false;

type AppendWord<
  Acc extends string,
  Word extends string,
  Mode extends CaseMode,
> = Word extends ''
  ? Acc
  : Mode extends 'snake'
  ? Acc extends '' ? Lowercase<Word> : `${Acc}_${Lowercase<Word>}`
  : Mode extends 'pascal'
  ? `${Acc}${Capitalize<Lowercase<Word>>}`
  : Acc extends '' ? Lowercase<Word> : `${Acc}${Capitalize<Lowercase<Word>>}`;

type ConvertKeyScan<
  S extends string,
  Mode extends CaseMode,
  SplitNumbers extends boolean,
  SeparateCapitals extends boolean = false,
  Acc extends string = '',
  Word extends string = '',
  Previous extends string = '',
> = string extends S
  ? string
  : S extends `${infer Head}${infer Tail}`
  ? string extends Head
    ? string
    : Head extends '_' | '-'
    ? ConvertKeyScan<Tail, Mode, SplitNumbers, SeparateCapitals, AppendWord<Acc, Word, Mode>>
    : Head extends Numbers
    ? TakeNumberRun<S> extends [infer Digits extends string, infer After extends string]
      ? SplitNumber<Previous, After, SplitNumbers> extends true
        ? ConvertKeyScan<After, Mode, SplitNumbers, SeparateCapitals, AppendWord<Acc, Word, Mode>, Digits, '0'>
        : ConvertKeyScan<After, Mode, SplitNumbers, SeparateCapitals, Acc, `${Word}${Digits}`, '0'>
      : never
    : Head extends CapitalLetters
    ? StartsWord<Previous, Tail, SeparateCapitals> extends true
      ? ConvertKeyScan<Tail, Mode, SplitNumbers, SeparateCapitals, AppendWord<Acc, Word, Mode>, Head, Head>
      : ConvertKeyScan<Tail, Mode, SplitNumbers, SeparateCapitals, Acc, `${Word}${Head}`, Head>
    : Head extends LowercaseLetters
    ? ConvertKeyScan<Tail, Mode, SplitNumbers, SeparateCapitals, Acc, `${Word}${Head}`, Head>
    : Extract<CapitalLetters | LowercaseLetters | Numbers | '_' | '-', Head> extends never
    ? ConvertKeyScan<Tail, Mode, SplitNumbers, SeparateCapitals, Acc, `${Word}${Head}`, Head>
    : string
  : S extends '' ? AppendWord<Acc, Word, Mode> : string;

type StartsWord<
  Previous extends string,
  Tail extends string,
  SeparateCapitals extends boolean,
> = SeparateCapitals extends true
  ? true
  : Previous extends LowercaseLetters | Numbers
    ? true
    : Previous extends CapitalLetters
    ? Tail extends `${LowercaseLetters}${string}` ? true : false
    : false;

type TakeNumberRun<
  S extends string,
  Acc extends string = '',
> = S extends `${infer Head}${infer Tail}`
  ? Head extends Numbers
    ? TakeNumberRun<Tail, `${Acc}${Head}`>
    : [Acc, S]
  : [Acc, ''];

type SplitNumber<
  Previous extends string,
  AfterNumber extends string,
  SplitNumbers extends boolean,
> = SplitNumbers extends false
  ? false
  : Previous extends LowercaseLetters
  ? AfterNumber extends `${CapitalLetters}${LowercaseLetters}${string}`
    ? false
    : true
  : false;

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
