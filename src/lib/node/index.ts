import { spaceId } from "../util/id";
import { NodeIO } from "./input-output";

export class Node {
  readonly id = spaceId();

  protected _inputs: NodeIO[] = [];
  protected _outputs: NodeIO[] = [];

  constructor(
    readonly name: string,
    readonly kind: string
  ) {}

  inputs(): NodeIO[];
  inputs(list: NodeIO[]): void;
  inputs(list?: NodeIO[]) {
    if (list)
      this._inputs = list;
    else
      return this._inputs;
  }

  addInput(input: NodeIO) {
    this._inputs.push(input);
  }

  removeInput(id: string): void;
  removeInput(input: NodeIO): void;
  removeInput(input: string | NodeIO) {
    if (typeof input === 'string')
      this._inputs = this._inputs.filter(i => i.id !== input);
    else
      this._inputs = this._inputs.filter(i => i.id !== input.id);
  }

  outputs(): NodeIO[];
  outputs(list: NodeIO[]): void;
  outputs(list?: NodeIO[]) {
    if (list)
      this._outputs = list;
    else
      return this._outputs;
  }

  addOutput(output: NodeIO) {
    this._outputs.push(output);
  }

  removeOutput(id: string): void;
  removeOutput(output: NodeIO): void;
  removeOutput(output: string | NodeIO) {
    if (typeof output === 'string')
      this._outputs = this._outputs.filter(i => i.id !== output);
    else
      this._outputs = this._outputs.filter(i => i.id !== output.id);
  }


}