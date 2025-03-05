
import { Rect, Text } from "fabric";
import { saleTypeStyles } from "../styles/saleTypeStyles";

export const createSaleTypeElements = (
  signageType: string, 
  canvasWidth: number, 
  canvasHeight: number, 
  isLandscape: boolean
) => {
  const saleStyle = saleTypeStyles[signageType as keyof typeof saleTypeStyles] || saleTypeStyles.Sale;
  
  const saleTypeRect = new Rect({
    left: canvasWidth - canvasWidth * 0.3,
    top: 0,
    width: canvasWidth * 0.3,
    height: canvasHeight * 0.15,
    fill: saleStyle.bgColor,
    selectable: false
  });
  
  const saleTypeText = new Text(signageType, {
    left: canvasWidth - canvasWidth * 0.15,
    top: canvasHeight * 0.075,
    fontSize: isLandscape ? 36 : 30,
    fontWeight: 'bold',
    fontFamily: 'Impact, Arial',
    fill: saleStyle.textColor,
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  return { saleTypeRect, saleTypeText };
};
