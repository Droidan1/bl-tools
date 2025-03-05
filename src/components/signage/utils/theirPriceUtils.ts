
import { Rect, Text } from "fabric";

export const createTheirPriceElements = (
  theirPrice: string,
  canvasWidth: number,
  canvasHeight: number,
  isLandscape: boolean
) => {
  if (!theirPrice) return null;
  
  const theirPriceContainer = new Rect({
    left: canvasWidth * 0.75,
    top: canvasHeight * 0.45,
    width: canvasWidth * 0.2,
    height: canvasWidth * 0.2,
    fill: '#3BB54A',
    selectable: false
  });
  
  const theirPriceLabel = new Text("THEIR PRICE", {
    left: canvasWidth * 0.85,
    top: canvasHeight * 0.41,
    fontSize: isLandscape ? 16 : 14,
    fontWeight: 'bold',
    fontFamily: 'Impact, Arial',
    fill: '#000000',
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  const theirPriceDollar = new Text("$", {
    left: canvasWidth * 0.8,
    top: canvasHeight * 0.47,
    fontSize: isLandscape ? 20 : 18,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fill: '#000000',
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  const theirPriceText = new Text(theirPrice, {
    left: canvasWidth * 0.85,
    top: canvasHeight * 0.5,
    fontSize: isLandscape ? 46 : 40,
    fontWeight: 'bold',
    fontFamily: 'Impact, Arial',
    fill: '#000000',
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  return { theirPriceContainer, theirPriceLabel, theirPriceDollar, theirPriceText };
};
