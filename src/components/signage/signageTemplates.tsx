
import { Canvas } from "fabric";
import { SignageData } from "@/types/signage";
import { createBackground } from "./utils/backgroundUtils";
import { createSaleTypeElements } from "./utils/saleTypeUtils";
import { createPriceElements } from "./utils/priceUtils";
import { createDescriptionElements } from "./utils/descriptionUtils";
import { createTheirPriceElements } from "./utils/theirPriceUtils";

export const renderSignageTemplate = (canvas: Canvas, signageData: SignageData) => {
  // Clear any existing objects
  canvas.clear();
  
  const isLandscape = signageData.dimensions === "11 in x 8.5 in";
  
  // Set dimensions for canvas
  const canvasWidth = canvas.getWidth() || (isLandscape ? 550 : 425);
  const canvasHeight = canvas.getHeight() || (isLandscape ? 425 : 550);
  
  // Create background
  const background = createBackground(canvas, canvasWidth, canvasHeight);
  canvas.add(background);

  // Create sale type elements
  const { saleTypeRect, saleTypeText } = createSaleTypeElements(
    signageData.saleType,
    canvasWidth,
    canvasHeight,
    isLandscape
  );
  
  // Create price elements
  const { priceDollarSign, priceText } = createPriceElements(
    signageData.price,
    canvasWidth,
    canvasHeight,
    isLandscape
  );
  
  // Create description elements
  const { descriptionRect, descriptionText } = createDescriptionElements(
    signageData.productDescription,
    canvasWidth,
    canvasHeight,
    isLandscape
  );
  
  // Add elements to canvas
  canvas.add(saleTypeRect);
  canvas.add(saleTypeText);
  canvas.add(priceDollarSign);
  canvas.add(priceText);
  canvas.add(descriptionRect);
  canvas.add(descriptionText);
  
  // Create and add their price elements if provided
  const theirPriceElements = createTheirPriceElements(
    signageData.theirPrice,
    canvasWidth,
    canvasHeight,
    isLandscape
  );
  
  if (theirPriceElements) {
    const { theirPriceContainer, theirPriceLabel, theirPriceDollar, theirPriceText } = theirPriceElements;
    canvas.add(theirPriceContainer);
    canvas.add(theirPriceLabel);
    canvas.add(theirPriceDollar);
    canvas.add(theirPriceText);
  }
  
  canvas.renderAll();
};
