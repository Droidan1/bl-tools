
import { Rect, Text } from "fabric";

export const createDescriptionElements = (
  description: string,
  canvasWidth: number,
  canvasHeight: number,
  isLandscape: boolean
) => {
  // Green bottom bar for product description
  const descriptionRect = new Rect({
    left: 0,
    top: canvasHeight - canvasHeight * 0.15,
    width: canvasWidth,
    height: canvasHeight * 0.15,
    fill: '#3BB54A',
    selectable: false
  });
  
  // Product description on green bar
  const descriptionText = new Text(description.toUpperCase() || 'PRODUCT DESCRIPTION', {
    left: canvasWidth * 0.5,
    top: canvasHeight - canvasHeight * 0.075,
    fontSize: isLandscape ? 36 : 30,
    fontWeight: 'bold',
    fontFamily: 'Impact, Arial',
    textAlign: 'center',
    fill: '#FFFFFF',
    width: canvasWidth * 0.9,
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  return { descriptionRect, descriptionText };
};
