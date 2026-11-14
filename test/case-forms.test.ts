import * as standard from '../src/index';
import * as noSplitNumbers from '../src/no-split-numbers';

// Every row independently checks the literal return types and runtime results.
const expected = {
  'AbcDEF': ['abcDEF', 'AbcDEF', 'abc_d_e_f', 'ABC_D_E_F', 'abcDEF', 'AbcDEF', 'abc_d_e_f', 'ABC_D_E_F'],
  'apiVersion': ['apiVersion', 'ApiVersion', 'api_version', 'API_VERSION', 'apiVersion', 'ApiVersion', 'api_version', 'API_VERSION'],
  'ΟΣ': ['οΣ', 'ΟΣ', 'ος', 'ΟΣ', 'οΣ', 'ΟΣ', 'ος', 'ΟΣ'],
  'CONTENT-TYPE': ['contentType', 'ContentType', 'content_type', 'CONTENT_TYPE', 'contentType', 'ContentType', 'content_type', 'CONTENT_TYPE'],
  'Content-Type': ['contentType', 'ContentType', 'content_type', 'CONTENT_TYPE', 'contentType', 'ContentType', 'content_type', 'CONTENT_TYPE'],
  'helloWorld': ['helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD', 'helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD'],
  'HelloWorld': ['helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD', 'helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD'],
  'hello_world': ['helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD', 'helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD'],
  'HELLO_WORLD': ['helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD', 'helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD'],
  'hello-world': ['helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD', 'helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD'],
  'Hello-World': ['helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD', 'helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD'],
  'HELLO-WORLD': ['helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD', 'helloWorld', 'HelloWorld', 'hello_world', 'HELLO_WORLD'],
  'HTTPServer': ['hTTPServer', 'HTTPServer', 'h_t_t_p_server', 'H_T_T_P_SERVER', 'hTTPServer', 'HTTPServer', 'h_t_t_p_server', 'H_T_T_P_SERVER'],
  'API_VERSION': ['apiVersion', 'ApiVersion', 'api_version', 'API_VERSION', 'apiVersion', 'ApiVersion', 'api_version', 'API_VERSION'],
  'XMLHttpRequest': ['xMLHttpRequest', 'XMLHttpRequest', 'x_m_l_http_request', 'X_M_L_HTTP_REQUEST', 'xMLHttpRequest', 'XMLHttpRequest', 'x_m_l_http_request', 'X_M_L_HTTP_REQUEST'],
  'getHTTPResponse': ['getHTTPResponse', 'GetHTTPResponse', 'get_h_t_t_p_response', 'GET_H_T_T_P_RESPONSE', 'getHTTPResponse', 'GetHTTPResponse', 'get_h_t_t_p_response', 'GET_H_T_T_P_RESPONSE'],
  'ABC': ['aBC', 'ABC', 'a_b_c', 'A_B_C', 'aBC', 'ABC', 'a_b_c', 'A_B_C'],
  'ABc': ['aBc', 'ABc', 'a_bc', 'A_BC', 'aBc', 'ABc', 'a_bc', 'A_BC'],
  'abcDEF': ['abcDEF', 'AbcDEF', 'abc_d_e_f', 'ABC_D_E_F', 'abcDEF', 'AbcDEF', 'abc_d_e_f', 'ABC_D_E_F'],
  'AbCdEFGh': ['abCdEFGh', 'AbCdEFGh', 'ab_cd_e_f_gh', 'AB_CD_E_F_GH', 'abCdEFGh', 'AbCdEFGh', 'ab_cd_e_f_gh', 'AB_CD_E_F_GH'],
  'myItem1': ['myItem1', 'MyItem1', 'my_item_1', 'MY_ITEM_1', 'myItem1', 'MyItem1', 'my_item1', 'MY_ITEM1'],
  'nextValue23': ['nextValue23', 'NextValue23', 'next_value_23', 'NEXT_VALUE_23', 'nextValue23', 'NextValue23', 'next_value23', 'NEXT_VALUE23'],
  's3Id': ['s3Id', 'S3Id', 's3_id', 'S3_ID', 's3Id', 'S3Id', 's3_id', 'S3_ID'],
  'api10Response': ['api10Response', 'Api10Response', 'api10_response', 'API10_RESPONSE', 'api10Response', 'Api10Response', 'api10_response', 'API10_RESPONSE'],
  'A1': ['a1', 'A1', 'a1', 'A1', 'a1', 'A1', 'a1', 'A1'],
  'a1': ['a1', 'A1', 'a_1', 'A_1', 'a1', 'A1', 'a1', 'A1'],
  'a1c2d': ['a1c2d', 'A1c2d', 'a_1c_2d', 'A_1C_2D', 'a1c2d', 'A1c2d', 'a1c2d', 'A1C2D'],
  'ab1c2D': ['ab1c2D', 'Ab1c2D', 'ab_1c_2_d', 'AB_1C_2_D', 'ab1c2D', 'Ab1c2D', 'ab1c2_d', 'AB1C2_D'],
  'HTTP2Status': ['hTTP2Status', 'HTTP2Status', 'h_t_t_p2_status', 'H_T_T_P2_STATUS', 'hTTP2Status', 'HTTP2Status', 'h_t_t_p2_status', 'H_T_T_P2_STATUS'],
  '8HelloWorld': ['8HelloWorld', '8HelloWorld', '8_hello_world', '8_HELLO_WORLD', '8HelloWorld', '8HelloWorld', '8_hello_world', '8_HELLO_WORLD'],
  'a__b': ['aB', 'AB', 'a_b', 'A_B', 'aB', 'AB', 'a_b', 'A_B'],
  'trailing_': ['trailing', 'Trailing', 'trailing', 'TRAILING', 'trailing', 'Trailing', 'trailing', 'TRAILING'],
  '__leading': ['leading', 'Leading', 'leading', 'LEADING', 'leading', 'Leading', 'leading', 'LEADING'],
  '_-hello__WORLD--again_-': ['helloWorldAgain', 'HelloWorldAgain', 'hello_world_again', 'HELLO_WORLD_AGAIN', 'helloWorldAgain', 'HelloWorldAgain', 'hello_world_again', 'HELLO_WORLD_AGAIN'],
  '': ['', '', '', '', '', '', '', ''],
  '_--__': ['', '', '', '', '', '', '', ''],
  '-1': ['-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1'],
  '+1.25': ['+1.25', '+1.25', '+1.25', '+1.25', '+1.25', '+1.25', '+1.25', '+1.25'],
  '-0.5': ['-0.5', '-0.5', '-0.5', '-0.5', '-0.5', '-0.5', '-0.5', '-0.5'],
  '42': ['42', '42', '42', '42', '42', '42', '42', '42'],
  'a.bC': ['a.bC', 'A.bC', 'a.b_c', 'A.B_C', 'a.bC', 'A.bC', 'a.b_c', 'A.B_C'],
  'a\nBC': ['a\nBC', 'A\nBC', 'a\n_b_c', 'A\n_B_C', 'a\nBC', 'A\nBC', 'a\n_b_c', 'A\n_B_C'],
  'éA': ['éA', 'ÉA', 'é_a', 'É_A', 'éA', 'ÉA', 'é_a', 'É_A'],
  'a_b_c_d_e_f_g_h_i_j_k_l_m': ['aBCDEFGHIJKLM', 'ABCDEFGHIJKLM', 'a_b_c_d_e_f_g_h_i_j_k_l_m', 'A_B_C_D_E_F_G_H_I_J_K_L_M', 'aBCDEFGHIJKLM', 'ABCDEFGHIJKLM', 'a_b_c_d_e_f_g_h_i_j_k_l_m', 'A_B_C_D_E_F_G_H_I_J_K_L_M'],
} as const;

const convert = <S extends string>(input: S) => [
  standard.toCamel(input),
  standard.toPascal(input),
  standard.toSnake(input),
  standard.toScreamingSnake(input),
  noSplitNumbers.toCamel(input),
  noSplitNumbers.toPascal(input),
  noSplitNumbers.toSnake(input),
  noSplitNumbers.toScreamingSnake(input),
] as const;

const actual = {
  'AbcDEF': convert('AbcDEF'),
  'apiVersion': convert('apiVersion'),
  'ΟΣ': convert('ΟΣ'),
  'CONTENT-TYPE': convert('CONTENT-TYPE'),
  'Content-Type': convert('Content-Type'),
  'helloWorld': convert('helloWorld'),
  'HelloWorld': convert('HelloWorld'),
  'hello_world': convert('hello_world'),
  'HELLO_WORLD': convert('HELLO_WORLD'),
  'hello-world': convert('hello-world'),
  'Hello-World': convert('Hello-World'),
  'HELLO-WORLD': convert('HELLO-WORLD'),
  'HTTPServer': convert('HTTPServer'),
  'API_VERSION': convert('API_VERSION'),
  'XMLHttpRequest': convert('XMLHttpRequest'),
  'getHTTPResponse': convert('getHTTPResponse'),
  'ABC': convert('ABC'),
  'ABc': convert('ABc'),
  'abcDEF': convert('abcDEF'),
  'AbCdEFGh': convert('AbCdEFGh'),
  'myItem1': convert('myItem1'),
  'nextValue23': convert('nextValue23'),
  's3Id': convert('s3Id'),
  'api10Response': convert('api10Response'),
  'A1': convert('A1'),
  'a1': convert('a1'),
  'a1c2d': convert('a1c2d'),
  'ab1c2D': convert('ab1c2D'),
  'HTTP2Status': convert('HTTP2Status'),
  '8HelloWorld': convert('8HelloWorld'),
  'a__b': convert('a__b'),
  'trailing_': convert('trailing_'),
  '__leading': convert('__leading'),
  '_-hello__WORLD--again_-': convert('_-hello__WORLD--again_-'),
  '': convert(''),
  '_--__': convert('_--__'),
  '-1': convert('-1'),
  '+1.25': convert('+1.25'),
  '-0.5': convert('-0.5'),
  '42': convert('42'),
  'a.bC': convert('a.bC'),
  'a\nBC': convert('a\nBC'),
  'éA': convert('éA'),
  'a_b_c_d_e_f_g_h_i_j_k_l_m': convert('a_b_c_d_e_f_g_h_i_j_k_l_m'),
};

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;
type RowChecks = {
  [Input in keyof typeof expected]: Equal<
    (typeof actual)[Input],
    (typeof expected)[Input]
  >;
};
const rowChecks: RowChecks = {
  'AbcDEF': true,
  'apiVersion': true,
  'ΟΣ': true,
  'CONTENT-TYPE': true,
  'Content-Type': true,
  'helloWorld': true,
  'HelloWorld': true,
  'hello_world': true,
  'HELLO_WORLD': true,
  'hello-world': true,
  'Hello-World': true,
  'HELLO-WORLD': true,
  'HTTPServer': true,
  'API_VERSION': true,
  'XMLHttpRequest': true,
  'getHTTPResponse': true,
  'ABC': true,
  'ABc': true,
  'abcDEF': true,
  'AbCdEFGh': true,
  'myItem1': true,
  'nextValue23': true,
  's3Id': true,
  'api10Response': true,
  'A1': true,
  'a1': true,
  'a1c2d': true,
  'ab1c2D': true,
  'HTTP2Status': true,
  '8HelloWorld': true,
  'a__b': true,
  'trailing_': true,
  '__leading': true,
  '_-hello__WORLD--again_-': true,
  '': true,
  '_--__': true,
  '-1': true,
  '+1.25': true,
  '-0.5': true,
  '42': true,
  'a.bC': true,
  'a\nBC': true,
  'éA': true,
  'a_b_c_d_e_f_g_h_i_j_k_l_m': true,
};

describe('all supported case forms', () => {
  it('returns each expected literal in both public entrypoints', () => {
    expect(actual).toEqual(expected);
    expect(Object.values(rowChecks).every(Boolean)).toBe(true);
  });
});

it('keeps general string inputs broad and distributes literal unions', () => {
  const input: string = 'HTTPServer';
  const broad = convert(input);
  const broadType: Equal<typeof broad, readonly [
    string, string, string, Uppercase<string>,
    string, string, string, Uppercase<string>,
  ]> = true;
  const convertUnion = (value: 'HTTPServer' | 'API_VERSION') => convert(value);
  const unionType: Equal<ReturnType<typeof convertUnion>, readonly [
    'hTTPServer' | 'apiVersion',
    'HTTPServer' | 'ApiVersion',
    'h_t_t_p_server' | 'api_version',
    'H_T_T_P_SERVER' | 'API_VERSION',
    'hTTPServer' | 'apiVersion',
    'HTTPServer' | 'ApiVersion',
    'h_t_t_p_server' | 'api_version',
    'H_T_T_P_SERVER' | 'API_VERSION',
  ]> = true;
  expect(broadType).toBe(true);
  expect(unionType).toBe(true);
  expect(broad).toEqual(expected.HTTPServer);
  expect(convertUnion('HTTPServer')).toEqual(expected.HTTPServer);
  expect(convertUnion('API_VERSION')).toEqual(expected.API_VERSION);
});
