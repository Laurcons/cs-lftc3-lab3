import { SymbolTable } from './symbol-table';
import { IntegerValue, StringValue, Value } from './value';
import hash from 'object-hash';

export enum PIFItemType {
  reserved = 'reserved',
  identifier = 'identifier',
  literal = 'literal',
}

export class PIFItem<T = any> {
  constructor(public type: PIFItemType, public key: string, public value?: Value<T>) {}
}

interface ScannerConfig {
  in: string;
  tokens: string[];
  delimiters: string[];
  symbolTable: SymbolTable;
}

export class Scanner {
  private _pif: PIFItem[] = [];
  private _points: string[]; // list of unicode points for input
  constructor(private _c: ScannerConfig) {
    this._points = [..._c.in];
  }

  private _arrEq<T>(arr1: T[], arr2: T[]) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((v, idx) => arr2[idx] === v);
  }

  private _isDot(char: string) {
    return char === '\n' || char === '.';
  }

  private _tryMatchToken(pos: number) {
    for (const token of this._c.tokens) {
      const tokPoints = [...token];
      if (
        this._arrEq(this._points.slice(pos, pos + tokPoints.length), tokPoints) &&
        (this._c.delimiters.includes(this._points[pos + tokPoints.length]) ||
          this._isDot(this._points[pos + tokPoints.length]))
      ) {
        return token;
      }
    }
    return null;
  }

  private _tryMatchIdentifier(pos: number) {
    let isFirst = true;
    const valid = [...'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ăîșțâĂȘȚÎÂ'];
    const invalidStart = [...'0123456789'];
    let tokenName = '';
    for (const char of this._points.slice(pos)) {
      if (!valid.includes(char)) break;
      if (isFirst && invalidStart.includes(char)) {
        return null;
      }
      isFirst = false;
      tokenName += char;
    }
    return tokenName !== '' ? tokenName : null;
  }

  private _tryMatchLiteral(pos: number): { value: Value<unknown>; length: number } | null {
    const integerRegex = /^([0-9]+)/u;
    const stringRegex = /^„([^”]*)”/u;
    const intMatch = integerRegex.exec(this._c.in.slice(pos));
    if (intMatch) {
      return {
        value: new IntegerValue(parseInt(intMatch[1])),
        length: intMatch[1].length,
      };
    }
    const stringMatch = stringRegex.exec(this._c.in.slice(pos));
    if (stringMatch) {
      return {
        value: new StringValue(stringMatch[1]),
        length: stringMatch[1].length + 2,
      };
    }
    return null;
  }

  scan() {
    debugger;
    // split in Unicode code points and surrogate pairs
    let pos = -1;
    let currentLine = 1;
    let currentColumn = 0; // 1 less
    while (true) {
      pos++;
      currentColumn++;
      if (pos >= this._points.length) break;
      const char = this._points[pos];

      if (this._c.delimiters.includes(char)) continue;

      if (this._isDot(char)) {
        if (char === '\n') {
          currentLine++;
          currentColumn = 1;
        }
        this._pif.push(new PIFItem(PIFItemType.reserved, 'DOT'));
        continue;
      }

      const token = this._tryMatchToken(pos);
      if (token) {
        this._pif.push(new PIFItem(PIFItemType.reserved, token));
        let inc = [...token].length - 1;
        pos += inc;
        currentColumn += inc;
        continue;
      }

      const identif = this._tryMatchIdentifier(pos);
      if (identif) {
        this._pif.push(new PIFItem(PIFItemType.identifier, identif));
        this._c.symbolTable.register(identif, null);
        let inc = [...identif].length - 1;
        pos += inc;
        currentColumn += inc;
        continue;
      }

      const literal = this._tryMatchLiteral(pos);
      if (literal) {
        const key = `LIT_${hash(literal.value)}`;
        this._pif.push(new PIFItem(PIFItemType.literal, key, literal.value));
        this._c.symbolTable.register(key, literal.value);
        let inc = literal.length - 1; // originally -1, but add 2 for „ and ”
        pos += inc;
        currentColumn += inc;
        continue;
      }

      throw `Parsing error at ${currentLine}:${currentColumn}: couldn't parse a token, nor a literal, nor a identifier`;
    }
  }

  pif() {
    return this._pif.map((item) => ({
      type: item.type,
      key: item.key,
      value: item.value?.value,
    }));
  }
}
