
import { Canvas, Rect } from "fabric";

export const createBackground = (canvas: Canvas, canvasWidth: number, canvasHeight: number) => {
  // Add white background with green border all the way around
  const background = new Rect({
    left: 0,
    top: 0,
    width: canvasWidth,
    height: canvasHeight,
    fill: '#FFFFFF',
    stroke: '#3BB54A',
    strokeWidth: 20,
    selectable: false
  });
  
  return background;
};
