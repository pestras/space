import { spaceId } from "../util/id";

export class NodeIO<T = any> {
  readonly id = spaceId();
  protected _connection: NodeIO<T> | null = null;
  protected _value: any = null;

  constructor(
    readonly name: string,
    readonly type: string
  ) { }

  value(): T;
  value(v: T): void;
  value(v?: T) {
    if (v)
      this._value = v;
    else
      return this._connection ? this._connection.value() : this._value
  }

  connection() {
    return this._connection;
  }

  connect(node: NodeIO<T> | null) {
    this._connection = node;
  }
}