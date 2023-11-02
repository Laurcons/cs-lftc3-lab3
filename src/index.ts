import { Scanner } from './scanner';
import { SymbolTable } from './symbol-table';

const inP = await Bun.file('p1.txt').text();
const tokens = (await Bun.file('tokens.txt').text()).split('\n');
const delimiters = [' '];
const st = new SymbolTable();
const scanner = new Scanner({
  delimiters,
  tokens,
  symbolTable: st,
  in: inP,
});
scanner.scan();
await Bun.write('pif.json', JSON.stringify(scanner.pif(), null, 2));
await Bun.write('symbols.json', JSON.stringify(st.list(), null, 2));
