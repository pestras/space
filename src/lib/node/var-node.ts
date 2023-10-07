import { Node } from ".";

export const dataTypes = ['boolean', 'int', 'double', 'string', 'date', 'array', 'object'] as const;

export type DataTypes = typeof dataTypes[number];

export class TypeDef {
  readonly type!: DataTypes;
}

export class BoolType extends TypeDef {
  readonly type = 'boolean'; 
}

export class IntType extends TypeDef {
  readonly type = 'int'; 
}

export class DooubleType extends TypeDef {
  readonly type = 'int'; 
}

export class StringType extends TypeDef {
  readonly type = 'string'; 
}

export class DateType extends TypeDef {
  readonly type = 'date'; 
}

export class ArrayType extends TypeDef {
  readonly type = 'array'; 
  
  protected _subType: TypeDef = new BoolType();
}

export class ObjectType extends TypeDef {
  readonly type = 'object'; 
  
  protected _subType: Record<string, TypeDef> = {};
}

export class VarNode extends Node {
  protected _value: any = null;

  constructor(name: string, readonly type: TypeDef) {
    super(name, 'var');
  }
}