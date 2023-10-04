import { Listeners } from "../listener";
import { Point } from "../point";
import { State } from "../state";
import { spaceId } from "../util/id";
import { features } from "./features";

export interface ShapeState {
  acceptChildren?: string[];
  acceptParents?: string[];
}

export interface ShapeStyle {
  visible?: boolean;
}

export abstract class Shape {
  readonly id = spaceId();
  readonly listeners: Listeners = {};
  readonly state: ShapeState = {};
  readonly style: ShapeStyle = { visible: true };
  readonly locals: Record<string, any> = {};

  private _draggable = false;
  private _arrowControl = false;


  // channels
  // ---------------------------------------------------------------------------------------
  private _channels = new Set<string>();

  channels() {
    return Array.from(this._channels);
  }

  addChannels(channels: string[]) {
    for (const c of channels)
      this._channels.add(c);
  }

  removeChannels(channels: string[]) {
    for (const c of channels)
      this._channels.delete(c);
  }

  hasChannel(channels: string[]) {
    return channels.some(c => this._channels.has(c));
  }

  // children & Attaching
  // ---------------------------------------------------------------------------------------
  protected _parent: Shape | null = null;
  private _children = new Map<string, Shape>();
  private childrenOrder: string[] = [];

  private _onNewParent(parent: Shape): void {
    if (!this.state.acceptChildren)
      return;

    this._parent = parent;
    this._vPos = new Point(parent.vPos().x + this.pos().x, parent.vPos().y + this.pos().y);

    this.listeners.newparent && this.listeners.newparent(parent);
  }

  private _onRemoveParent(): void {
    this._parent = null;
    this._vPos = this._pos.clone();

    this.listeners.removeparent && this.listeners.removeparent();
  }

  addChild(shape: Shape) {
    if (!this.state.acceptParents)
      return;

    this._children.set(shape.id, shape);
    this.childrenOrder.push(shape.id);

    this.listeners.newchild && this.listeners.newchild(shape);
    shape._onNewParent(this);

    return this;
  }

  removeChild(shape: Shape) {
    if (!this._children.has(shape.id))
      return;
    
    this._children.delete(shape.id);
    this.childrenOrder = this.childrenOrder.filter(id => id !== shape.id);

    this.listeners.removechild && this.listeners.removechild();
    shape._onRemoveParent();

    return this;
  }

  children() {
    return this.childrenOrder.map(id => this._children.get(id)).filter(Boolean) as Shape[];
  }

  // Positioning
  // ---------------------------------------------------------------------------------------
  private _pos = new Point();
  private _vPos = new Point();

  pos() {
    return this._pos;
  }

  vPos() {
    return this._vPos;
  }

  setPos(newPos: Point) {
    this._pos = newPos;

    if (this._parent)
      this._vPos = new Point(this._parent.vPos().x + this.pos().x, this._parent.vPos().y + this.pos().y);
    else
      this._vPos = this._pos.clone();
  }

  // events
  // ---------------------------------------------------------------------------------------
  private _isPointIn(point: Point): Shape | null {
    const children = this.children();

    for (let i = children.length - 1; i >= 0; i--) {
      const shape = children[i].isPointIn(point)

      if (shape)
        return shape;
    }

    return this.isPointIn(point);
  }

  abstract isPointIn(point: Point): Shape | null;

  on<T extends keyof Listeners>(event: T, cb: Listeners[T]) {
    this.listeners[event] = cb;
  }

  off(event: keyof Listeners) {
    delete this.listeners[event];
  }

  // features
  // --------------------------------------------------------------------------------------
  
  // dragging
  // ----------------------------------------------------------------------------------
  get draggable() {
    return this._draggable;
  }

  set draggable(value: boolean) {
    if (value === this._draggable)
      return;

    this._draggable = value;
    this._draggable ? features.drag.enable(this) : features.drag.disable(this);
  }

  // arrow control
  // ----------------------------------------------------------------------------------
  get arrowControl() {
    return this._arrowControl;
  }

  set arrowControl(value: boolean) {
    if (value === this._arrowControl)
      return;

    this._arrowControl = value;
    this._arrowControl ? features.arrowControl.enable(this) : features.arrowControl.disable(this);
  }

  // drawing
  // ---------------------------------------------------------------------------------------
  private _draw(state: State): void {
    if (!this.style.visible)
      return;

    for (const child of this.children())
      child.draw(state);

    this.draw(state);
  }

  abstract draw(state: State): void;

  // static
  // -------------------------------------------------------------------------------------
  static draw(shape: Shape, state: State) {
    shape._draw(state);
  }

  static isPointIn(shape: Shape, point: Point) {
    return shape._isPointIn(point);
  }
}