import { Shape } from "./shapes/shape";
import { State } from "./state";

export interface KeyHold {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
}

export interface Listeners {
  // state context events
  click?: (state: State) => boolean | void;
  mousein?: (state: State) => boolean | void;
  mouseout?: (state: State) => boolean | void;
  mousemove?: (state: State) => boolean | void;
  mousedown?: (state: State) => boolean | void;
  mouseup?: (state: State) => boolean | void;
  keydown?: (state: State) => boolean | void;
  keypress?: (state: State) => boolean | void;
  keyup?: (state: State) => boolean | void;
  select?: (state: State) => boolean | void;
  deselect?: (state: State) => boolean | void;
  dragstart?: (state: State) => boolean | void;
  drag?: (state: State) => boolean | void;
  dragend?: (state: State) => boolean | void;
  dragin?: (state: State) => boolean | void;
  dropin?: (state: State) => boolean | void;
  dragshapein?: (state: State) => boolean | void;
  dropshapein?: (state: State) => boolean | void;
  // shape context events
  /** attached to a parent */
  newparent?: (parent: Shape) => void;
  /** deattached from a parent */
  removeparent?: () => void;
  /** new child added */
  newchild?: (child: Shape) => void;
  /** child was removed */
  removechild?: () => void;
}