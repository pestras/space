import { Node } from ".";

export class FlowNode extends Node {
  protected _prevNode: Node | null = null;
  protected _nextNode: Record<string, Node> = {};
}