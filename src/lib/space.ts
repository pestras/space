import { drawGrid } from "./grid";
import { Point } from "./point";
import { Shape } from "./basic-shapes/shape";
import { Size } from "./size";
import { State } from "./state";
import { SpaceTheme, defaultSpaceTheme } from "./theme";
import { getMousePos } from "./util/mouse";

const ZOOM_LIMIT = [0.2, 8];

export interface SpaceOptions {
  showGrid: boolean;
  theme: Partial<SpaceTheme>;
}

const defaultSpaceOptions: SpaceOptions = {
  showGrid: true,
  theme: defaultSpaceTheme
}

export class Space {
  private readonly options!: SpaceOptions;
  private readonly _shapes = new Map<string, Shape>();
  private shapesOrder: string[] = [];
  private isPanning = false;

  state!: State;

  constructor(readonly canvas: HTMLCanvasElement, options?: SpaceOptions) {

    this.options = Object.assign({}, defaultSpaceOptions, options ?? {});

    const canvasSize = new Size(this.canvas.clientWidth, +this.canvas.clientHeight);
    const offset = new Point(canvasSize.w / 2, canvasSize.h / 2);

    this.state = {
      ctx: this.canvas.getContext("2d") as CanvasRenderingContext2D,
      canvasSize: canvasSize,
      viewSize: canvasSize.clone(),
      offset: offset,
      viewOffset: offset.clone(),
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      dragged: null,
      selected: null,
      hovered: null,
      key: null,
      mousePos: new Point(),
      mouseViewPos: new Point(),
      style: Object.assign({}, defaultSpaceOptions.theme, options?.theme ?? {}) as SpaceTheme,
      zoom: 1
    }

    this.state.ctx.transform(this.state.zoom, 0, 0, this.state.zoom, this.state.offset.x, this.state.offset.y);
    this.initMouseEvents();

    this.draw();
  }

  draw() {
    this.state.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.state.ctx.clearRect(0, 0, this.state.canvasSize.w, this.state.canvasSize.h);

    this.state.ctx.setTransform(this.state.zoom, 0, 0, this.state.zoom, this.state.offset.x, this.state.offset.y);

    // grid
    this.options.showGrid && drawGrid(this.state);

    for (const shape of this.shapes()) {
      this.state.ctx.save();
      Shape.draw(shape, this.state);
      this.state.ctx.restore();
    }
  }

  // Mouse event handling
  // ------------------------------------------------------------------------------------------------------------
  private setMousePos(e: MouseEvent) {
    // get mouse position regardless of current zoom;
    this.state.mousePos = getMousePos(e, this.canvas);
    // calculate mouse position taking zoom into consideration
    this.state.mouseViewPos = new Point(
      (this.state.mousePos.x / this.state.zoom) - this.state.viewOffset.x,
      (this.state.mousePos.y / this.state.zoom) - this.state.viewOffset.y
    );
  }

  private initMouseEvents() {
    this.canvas.addEventListener("click", e => {
      this.setMousePos(e);

      // find the shape that is being clicked
      const mouseInShape = this.state.hovered;

      if (this.state.selected && this.state.selected !== mouseInShape)
        this.state.selected?.listeners.deselect && this.state.selected.listeners.deselect(this.state);

      // when found check if has listener
      if (mouseInShape) {
        this.state.selected = mouseInShape
        mouseInShape.listeners.select && mouseInShape.listeners.select(this.state);
        mouseInShape.listeners.click && mouseInShape.listeners.click(this.state);
      }
      // otherwise clear focus and dragging shapes from the state  
      else {
        this.state.selected = null;
        this.state.dragged = null;
      }

      this.draw();
    });

    this.canvas.addEventListener("mousedown", e => {
      this.setMousePos(e);

      // find shape under moouse position
      const mouseInShape = this.state.hovered;

      if (this.state.selected && this.state.selected !== mouseInShape)
        this.state.selected?.listeners.deselect && this.state.selected.listeners.deselect(this.state);

      // update state when shape is draggable or focusable
      if (mouseInShape) {
        if (mouseInShape.listeners.dragstart) {
          this.state.dragged = mouseInShape;
          mouseInShape.listeners.dragstart && mouseInShape.listeners.dragstart(this.state);

        } else
          mouseInShape.listeners.mousedown && mouseInShape.listeners.mousedown(this.state);

        this.state.selected = mouseInShape;
        mouseInShape.listeners.select && mouseInShape.listeners.select(this.state);
      }
      // otherwise activate panning action 
      else
        this.isPanning = true;

      this.draw();
    });

    this.canvas.addEventListener("mousemove", e => {
      const mPos = getMousePos(e, this.canvas);

      if (this.isPanning) {
        const offsetAmount = new Point(mPos.x - this.state.mousePos.x, mPos.y - this.state.mousePos.y);

        this.state.offset = new Point(this.state.offset.x + offsetAmount.x, this.state.offset.y + offsetAmount.y);
        this.state.viewOffset = new Point(this.state.offset.x / this.state.zoom, this.state.offset.y / this.state.zoom);

      } else {
        let hoverOnShape: Shape | null = null;
        const draggingShape = this.state.dragged;

        const shapes = this.shapes();

        for (let i = shapes.length - 1; i >= 0; i--) {
          hoverOnShape = Shape.isPointIn(shapes[i], this.state.mouseViewPos, this.state);

          if (hoverOnShape) {
            if (hoverOnShape === this.state.dragged)
              continue;

            break;
          }
        }

        if (this.state.hovered && this.state.hovered !== hoverOnShape)
          this.state.hovered.listeners.mouseout && this.state.hovered.listeners.mouseout(this.state);

        if (hoverOnShape) {
          if (this.state.hovered !== hoverOnShape) {
            this.state.hovered = hoverOnShape;
            hoverOnShape.listeners.mousein && hoverOnShape.listeners.mousein(this.state);
          } else {
            hoverOnShape.listeners.mousemove && hoverOnShape.listeners.mousemove(this.state);
          }
        } else {
          this.state.hovered = null;
        }

        if (draggingShape) {
          draggingShape.listeners.drag && draggingShape.listeners.drag(this.state);

          if (hoverOnShape) {
            const isMatch = draggingShape.hasChannel(hoverOnShape.state.acceptChildren || [])
              && hoverOnShape.hasChannel(draggingShape.state.acceptParents || []);

            if (isMatch) {
              hoverOnShape.listeners.dragshapein && hoverOnShape.listeners.dragshapein(this.state);
              draggingShape.listeners.dragin && draggingShape.listeners.dragin(this.state);
            }
          }
        }
      }

      this.setMousePos(e);
      this.draw();
    });

    document.addEventListener("mouseup", e => {
      this.setMousePos(e);

      const draggingShape = this.state.dragged;
      const mouseInShape = this.state.hovered

      if (draggingShape) {
        draggingShape.listeners.dragend && draggingShape.listeners.dragend(this.state);

        if (mouseInShape) {
          const isMatch = draggingShape.hasChannel(mouseInShape.state.acceptChildren || [])
            && mouseInShape.hasChannel(draggingShape.state.acceptParents || []);

          if (isMatch) {
            mouseInShape.listeners.dragshapein && mouseInShape.listeners.dragshapein(this.state);
            draggingShape.listeners.dropin && draggingShape.listeners.dropin(this.state);
          }
        }
      }

      if (mouseInShape && mouseInShape.listeners.mouseup)
        mouseInShape.listeners.mouseup(this.state);

      this.isPanning = false;
      this.state.dragged = null;

      this.draw();
    });

    this.canvas.addEventListener('wheel', e => {
      this.setMousePos(e);

      const oldScale = this.state.zoom;
      const newScaleTmp = oldScale + (e.deltaY * -0.01);
      const newScale = newScaleTmp > ZOOM_LIMIT[1] ? ZOOM_LIMIT[1] : newScaleTmp < ZOOM_LIMIT[0] ? ZOOM_LIMIT[0] : newScaleTmp;
      this.state.offset = new Point(
        this.state.mousePos.x - (this.state.mousePos.x - this.state.offset.x) * (newScale / oldScale),
        this.state.mousePos.y - (this.state.mousePos.y - this.state.offset.y) * (newScale / oldScale),
      );

      this.state.zoom = newScale;
      this.state.viewOffset = new Point(this.state.offset.x / this.state.zoom, this.state.offset.y / this.state.zoom);
      this.state.viewSize = new Size(this.state.canvasSize.w / this.state.zoom, this.state.canvasSize.h / this.state.zoom);

      this.draw();
    });

    document.addEventListener('keydown', e => {
      this.state.altKey = e.altKey;
      this.state.shiftKey = e.shiftKey;
      this.state.ctrlKey = e.ctrlKey;
      this.state.key = e.key;

      // check if current state has focused shape and has listener
      if (this.state.selected && this.state.selected.listeners.keydown)
        this.state.selected.listeners.keydown(this.state);

      this.draw();
    });

    document.addEventListener('keyup', e => {
      this.state.key = e.key;
      this.state.altKey = false;
      this.state.shiftKey = false;
      this.state.ctrlKey = false;

      // check if current state has focused shape and has listener
      if (this.state.selected && this.state.selected.listeners.keyup)
        this.state.selected.listeners.keyup(this.state);

      this.draw();
    });

    document.addEventListener('keypress', e => {
      this.state.key = e.key;
      this.state.altKey = false;
      this.state.shiftKey = false;
      this.state.key = e.key;

      // check if current state has focused shape and has listener
      if (this.state.selected && this.state.selected.listeners.keypress)
        this.state.selected.listeners.keypress(this.state);

      this.draw();
    });
  }

  // layers api
  // -----------------------------------------------------------------------------------------------------------------
  addShape(shape: Shape) {
    this._shapes.set(shape.id, shape);
    this.shapesOrder.push(shape.id);

    return this;
  }

  removeShape(shape: Shape) {
    this._shapes.delete(shape.id);
    this.shapesOrder = this.shapesOrder.filter(id => id !== shape.id);

    return this;
  }

  shapes() {
    return this.shapesOrder.map(id => this._shapes.get(id)).filter(Boolean) as Shape[];
  }

  get length() {
    return this._shapes.size;
  }

  // ordering
  // --------------------------------------------------------------------------------------------

}