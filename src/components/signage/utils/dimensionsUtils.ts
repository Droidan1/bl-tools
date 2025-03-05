
import { Canvas } from "fabric";

export interface CanvasDimensions {
  width: number;
  height: number;
}

export const getCanvasDimensions = (canvas: Canvas, isLandscape: boolean): CanvasDimensions => {
  return {
    width: canvas.getWidth() || (isLandscape ? 550 : 425),
    height: canvas.getHeight() || (isLandscape ? 425 : 550)
  };
};
