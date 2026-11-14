import * as standard from '../src/index';
import * as noSplitNumbers from '../src/no-split-numbers';

describe.each([
  ['standard', standard],
  ['no-split-numbers', noSplitNumbers],
] as const)('%s kebab input', (_name, converters) => {
  it('converts lower-kebab input to all four cases with matching literal types', () => {
    const output: readonly ['contentType', 'ContentType', 'content_type', 'CONTENT_TYPE'] = [
      converters.toCamel('content-type'),
      converters.toPascal('content-type'),
      converters.toSnake('content-type'),
      converters.toScreamingSnake('content-type'),
    ];
    expect(output).toEqual(['contentType', 'ContentType', 'content_type', 'CONTENT_TYPE']);
  });

  it('converts UPPER-KEBAB input to all four cases with matching literal types', () => {
    const output: readonly ['contentType', 'ContentType', 'content_type', 'CONTENT_TYPE'] = [
      converters.toCamel('CONTENT-TYPE'),
      converters.toPascal('CONTENT-TYPE'),
      converters.toSnake('CONTENT-TYPE'),
      converters.toScreamingSnake('CONTENT-TYPE'),
    ];
    expect(output).toEqual(['contentType', 'ContentType', 'content_type', 'CONTENT_TYPE']);
  });

  it('converts the reported Content-Type spelling with matching literal types', () => {
    const output: readonly ['contentType', 'ContentType', 'content_type', 'CONTENT_TYPE'] = [
      converters.toCamel('Content-Type'),
      converters.toPascal('Content-Type'),
      converters.toSnake('Content-Type'),
      converters.toScreamingSnake('Content-Type'),
    ];
    expect(output).toEqual(['contentType', 'ContentType', 'content_type', 'CONTENT_TYPE']);
  });

  it('converts lower, upper, and title kebab keys in nested objects and arrays', () => {
    const input = {
      'content-type': {
        'ACCEPT-ENCODING': [{ 'Cache-Control': 'value' }],
      },
    };
    const camel = converters.objectToCamel(input);
    const pascal = converters.objectToPascal(input);
    const snake = converters.objectToSnake(input);
    const screaming = converters.objectToScreamingSnake(input);

    const values: string[] = [
      camel.contentType.acceptEncoding[0].cacheControl,
      pascal.ContentType.AcceptEncoding[0].CacheControl,
      snake.content_type.accept_encoding[0].cache_control,
      screaming.CONTENT_TYPE.ACCEPT_ENCODING[0].CACHE_CONTROL,
    ];
    expect(values).toEqual(['value', 'value', 'value', 'value']);
    expect(camel).toEqual({ contentType: { acceptEncoding: [{ cacheControl: 'value' }] } });
    expect(pascal).toEqual({ ContentType: { AcceptEncoding: [{ CacheControl: 'value' }] } });
    expect(snake).toEqual({ content_type: { accept_encoding: [{ cache_control: 'value' }] } });
    expect(screaming).toEqual({ CONTENT_TYPE: { ACCEPT_ENCODING: [{ CACHE_CONTROL: 'value' }] } });
    expect(input).toEqual({ 'content-type': { 'ACCEPT-ENCODING': [{ 'Cache-Control': 'value' }] } });
  });
});
