export enum ValueType {
  integer = 'integer',
  string = 'string',
  array = 'array',
}

export abstract class Value<T = unknown> {
  public abstract get type(): ValueType;
  public abstract get value(): T;
}

export class IntegerValue extends Value<number> {
  constructor(private _value: number) {
    super();
  }

  get type() {
    return ValueType.integer;
  }

  get value() {
    return this._value;
  }
}

export class StringValue extends Value<string> {
  constructor(private _value: string) {
    super();
  }

  get type() {
    return ValueType.integer;
  }

  get value() {
    return this._value;
  }
}

export class ArrayValue extends Value<Value[]> {
  constructor(private _value: Value[]) {
    super();
  }

  get type() {
    return ValueType.array;
  }

  get value() {
    return this._value;
  }
}
