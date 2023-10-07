import { FlowNode } from "./flow-node";

export const logicalOperators = ['&', '|', '=', '!==', '>', '>=', '<', '<='] as const;
export type LogicalOperators = typeof logicalOperators[number];

export class LogicalNode extends FlowNode {
  protected _operator: LogicalOperators = '=';
}