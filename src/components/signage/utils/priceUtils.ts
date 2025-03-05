
import { Text } from "fabric";

export const createPriceElements = (
  price: string,
  canvasWidth: number,
  canvasHeight: number,
  isLandscape: boolean
) => {
  // Dollar sign for price
  const priceDollarSign = new Text("$", {
    left: canvasWidth * 0.4,
    top: canvasHeight * 0.4,
    fontSize: isLandscape ? 60 : 50,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fill: '#000000',
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  // Price display - centered
  const priceText = new Text(price || '10', {
    left: canvasWidth * 0.5,
    top: canvasHeight * 0.4,
    fontSize: isLandscape ? 220 : 180,
    fontWeight: 'bold',
    fontFamily: 'Impact, Arial',
    fill: '#000000',
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  return { priceDollarSign, priceText };
};
