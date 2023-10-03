import { Point } from "./point";
import { Shape } from "./shapes/shape";
import { Size } from "./size";
import { SpaceTheme } from "./theme";

export interface State {
  // drawing context
  ctx: CanvasRenderingContext2D;
  /** canvas original size */
  canvasSize: Size;
  /** view size with scale in consideration */
  viewSize: Size;
  /** view offset with scale in consideration */
  offset: Point;
  /** view offset with scale in consideration */
  viewOffset: Point;
  /** view scale */
  zoom: number;
  /** mouse position */
  mousePos: Point;
  /** mouse position */
  mouseViewPos: Point;
  /** alt key pressed */
  altKey: boolean;
  /** shift key pressed */
  shiftKey: boolean;
  /** control key pressed */
  ctrlKey: boolean;
  /** keyboard key pressed */
  key: string | null;
  /** Theme style */
  style: SpaceTheme;
  /** shape being dragged */
  dragged: Shape | null;
  /** current shape in focus  */
  selected: Shape | null;
  /** current hoverd shape  */
  hovered: Shape | null;
}