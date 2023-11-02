import { SymbolTable } from './symbol-table';
import { expect, test } from 'bun:test';
import { IntegerValue, StringValue } from './value';

test('Test symbol table', () => {
  const st = new SymbolTable();

  st.register('aaa', new IntegerValue(4));
  st.register('ccc', new IntegerValue(1));
  st.register('bbb', new IntegerValue(2));
  st.register('abb', new StringValue('hey'));

  expect(st.get('aaa').value!.value).toBe(4);
  expect(st.get('bbb').value!.value).toBe(2);
  expect(st.get('ccc').value!.value).toBe(1);
  expect(st.get('abb').value!.value).toBe('hey');

  expect(st.has('aaa')).toBeTrue();
  expect(st.has('bbb')).toBeTrue();
  expect(st.has('ccc')).toBeTrue();
  expect(st.has('abb')).toBeTrue();
  expect(st.has('xxx')).toBeFalse();

  st.register('null', null);
  expect(st.has('null')).toBeTrue();
  expect(st.get('null').value).toBeNull();
});
