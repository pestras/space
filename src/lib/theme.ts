export interface SpaceTheme {
  opacity: number;
  fill: string;
  strokeStyle: string;
  lineWidth: number;
  lineJoin: CanvasLineJoin;
  lineCap: CanvasLineCap;
  // fotn
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontStrokeStyle: string;
  fontLineWidth: number;
  fontLineJoin: CanvasLineJoin;
  fontLineCap: CanvasLineCap;
}

export const defaultSpaceTheme: SpaceTheme = {
  opacity: 1,
  fill: '#FF4466',
  strokeStyle: '#442233',
  lineWidth: 2,
  lineJoin: 'round',
  lineCap: 'round',
  // font
  fontFamily: 'Arial',
  fontSize: 16,
  fontColor: '#334',
  fontStrokeStyle: '#442233',
  fontLineWidth: 0,
  fontLineJoin: 'round',
  fontLineCap: 'round',
}