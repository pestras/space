import { Listeners } from "./listener";
import { Point } from "./point";
import { State } from "./state";
import { spaceId } from "./util/id";

export interface ShapeState {
  acceptChildren?: string[];
  acceptParents?: string[];
}

export interface ShapeStyle {
  visible?: boolean;
  fill?: string;
}

export abstract class Shape {
  readonly id = spaceId();
  readonly listeners: Listeners = {};
  readonly state: ShapeState = {};
  readonly style: ShapeStyle = {};
  readonly locals: Record<string, any> = {};


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

  private _onAttach(parent: Shape): void {
    if (!this.state.acceptChildren)
      return;

    this._parent = parent;
    this._vPos = new Point(parent.vPos().x + this.pos().x, parent.vPos().y + this.pos().y);

    this.listeners.attached && this.listeners.attached(parent);
  }

  private _onDeattach(): void {
    this._parent = null;
    this._vPos = this._pos.clone();

    this.listeners.deattached && this.listeners.deattached();
  }

  addChild(shape: Shape) {
    if (!this.state.acceptParents)
      return;

    this._children.set(shape.id, shape);
    this.childrenOrder.push(shape.id);

    this.listeners.childAdded && this.listeners.childAdded(shape);
    shape._onAttach(this);

    return this;
  }

  removeChild(shape: Shape) {
    this._children.delete(shape.id);
    this.childrenOrder = this.childrenOrder.filter(id => id !== shape.id);

    this.listeners.childRemoved && this.listeners.childRemoved();
    shape._onDeattach();

    return this;
  }

  children() {
    return this.childrenOrder.map(id => this._children.get(id)).filter(Boolean) as Shape[];
  }

  length() {
    return this._children.size;
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
  private _isPointInChild(point: Point): Shape | null {
    const children = this.children();

    for (let i = children.length - 1; i >= 0; i--) {
      const shape = children[i].isPointIn(point)

      if (shape)
        return shape;
    }

    return null;
  }

  isPointIn(point: Point): Shape | null {
    const child = this._isPointInChild(point);

    return child ?? null;
  }

  on<T extends keyof Listeners>(event: T, cb: Listeners[T]) {
    this.listeners[event] = cb;
  }

  off(event: keyof Listeners) {
    delete this.listeners[event];
  }

  // drawing
  // ---------------------------------------------------------------------------------------
  draw(state: State): void {
    if (!this.style.visible)
      return;

    for (const child of this.children())
      child.draw(state);
  }
}