export interface SpaceTheme {
  fill: string;
  stroke: string;
  lineWidth: number;
  lineJoin: CanvasLineJoin;
  lineCap: CanvasLineCap;
}

export const defaultSpaceTheme: SpaceTheme = {
  fill: '#FF4466',
  stroke: '#442233',
  lineWidth: 2,
  lineJoin: 'round',
  lineCap: 'round'
}