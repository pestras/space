import { Point } from "../point";

export function getMousePos(e: MouseEvent, canvas: HTMLCanvasElement) {
  return new Point(
    e.clientX - canvas.offsetLeft,
    e.clientY - canvas.offsetTop
  )
};