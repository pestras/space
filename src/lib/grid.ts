import { Point } from "./point";
import { State } from "./state";

export function drawGrid(state: State) {
  // main grid
  // -----------------------------------------------------------------------------------------------
  const gSize = 16 / state.zoom;
  const lineWidth = 1 / state.zoom
  const gStartOffset = new Point(gSize - (state.viewOffset.x % gSize), gSize - (state.viewOffset.y % gSize));
  const vCount = Math.ceil(state.viewSize.w / gSize);
  const hCount = Math.ceil(state.viewSize.h / gSize);

  state.ctx.strokeStyle = '#DADADA';
  state.ctx.lineWidth = lineWidth;
  state.ctx.beginPath();

  for (let o = (-state.viewOffset.x - gStartOffset.x), i = 0; i <= vCount; i++, o += gSize) {
    state.ctx.moveTo(o, -state.viewOffset.y);
    state.ctx.lineTo(o, -state.viewOffset.y + state.viewSize.h);
  }

  for (let o = -state.viewOffset.y - gStartOffset.y, i = 0; i <= hCount; i++, o += gSize) {
    state.ctx.moveTo(-state.viewOffset.x, o);
    state.ctx.lineTo((-state.viewOffset.x + state.viewSize.w), o);
  }

  state.ctx.stroke();

  // secondary grid
  // -----------------------------------------------------------------------------------------------
  let sgSize = gSize * 8;
  let sgStartOffset = new Point(sgSize - (state.viewOffset.x % sgSize), sgSize - (state.viewOffset.y % sgSize));
  const sgVCount = Math.ceil(state.viewSize.w / sgSize);
  const sgHCount = Math.ceil(state.viewSize.h / sgSize);

  state.ctx.strokeStyle = '#DDD';
  state.ctx.lineWidth = lineWidth * 2;
  state.ctx.beginPath();

  for (let o = -state.viewOffset.x - sgStartOffset.x, i = 0; i <= sgVCount; i++, o += sgSize) {
    state.ctx.moveTo(o, -state.viewOffset.y);
    state.ctx.lineTo(o, -state.viewOffset.y + state.viewSize.h);
  }

  for (let o = (-state.viewOffset.y - sgStartOffset.y), i = 0; i <= sgHCount; i++, o += sgSize) {
    state.ctx.moveTo(-state.viewOffset.x, o);
    state.ctx.lineTo(-state.viewOffset.x + state.viewSize.w, o);
  }

  state.ctx.stroke()

  // main axies
  // -----------------------------------------------------------------------------------------------
  state.ctx.strokeStyle = '#CACACA';
  state.ctx.lineWidth = lineWidth * 3;
  state.ctx.beginPath();
  state.ctx.moveTo(0, -state.viewOffset.y);
  state.ctx.lineTo(0, (-state.viewOffset.y) + state.viewSize.h);
  state.ctx.moveTo(-state.viewOffset.x, 0);
  state.ctx.lineTo(-state.viewOffset.x + state.viewSize.w, 0);
  state.ctx.stroke();
}