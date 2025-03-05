
import { Canvas, Text, Rect } from "fabric";
import { SignageData } from "@/types/signage";

// Common styles for different sale types
const saleTypeStyles = {
  'Sale': {
    bgColor: '#e5393580',
    textColor: '#FFFFFF',
  },
  'Clearance': {
    bgColor: '#f97316a0',
    textColor: '#FFFFFF',
  },
  'Wow Deal': {
    bgColor: '#8b5cf6a0',
    textColor: '#FFFFFF',
  },
  'New Arrival': {
    bgColor: '#0ea5e9a0',
    textColor: '#FFFFFF',
  },
  'Blow Out': {
    bgColor: '#dc2626a0',
    textColor: '#FFFFFF',
  }
};

export const renderSignageTemplate = (canvas: Canvas, signageData: SignageData) => {
  // Clear any existing objects
  canvas.clear();
  
  const isLandscape = signageData.dimensions === "11 in x 8.5 in";
  
  // Set background
  const canvasWidth = canvas.getWidth() || (isLandscape ? 550 : 425);
  const canvasHeight = canvas.getHeight() || (isLandscape ? 425 : 550);
  
  // Add white background
  const background = new Rect({
    left: 0,
    top: 0,
    width: canvasWidth,
    height: canvasHeight,
    fill: '#FFFFFF',
    selectable: false
  });
  canvas.add(background);

  // Add sale type header
  const saleStyle = saleTypeStyles[signageData.saleType as keyof typeof saleTypeStyles] || saleTypeStyles.Sale;
  
  const saleTypeRect = new Rect({
    left: 0,
    top: 0,
    width: canvasWidth,
    height: canvasHeight * 0.15,
    fill: saleStyle.bgColor,
    selectable: false
  });
  
  const saleTypeText = new Text(signageData.saleType.toUpperCase(), {
    left: canvasWidth / 2,
    top: canvasHeight * 0.075,
    fontSize: isLandscape ? 36 : 32,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fill: saleStyle.textColor,
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  // Price display
  const priceText = new Text(signageData.price || '$0.00', {
    left: canvasWidth / 2,
    top: canvasHeight * 0.4,
    fontSize: isLandscape ? 64 : 56,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fill: '#000000',
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  // Product description
  const descriptionText = new Text(signageData.productDescription || 'Product Description', {
    left: canvasWidth / 2,
    top: canvasHeight * 0.6,
    fontSize: isLandscape ? 28 : 24,
    fontFamily: 'Arial',
    textAlign: 'center',
    fill: '#000000',
    width: canvasWidth * 0.9,
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  // Their price (comparison)
  let theirPriceContainer = null;
  let theirPriceText = null;
  let theirPriceLabel = null;
  
  if (signageData.theirPrice) {
    theirPriceContainer = new Rect({
      left: canvasWidth * 0.6,
      top: canvasHeight * 0.75,
      width: canvasWidth * 0.35,
      height: canvasHeight * 0.15,
      fill: '#f1f1f1',
      rx: 8,
      ry: 8,
      selectable: false
    });
    
    theirPriceLabel = new Text('Their Price', {
      left: canvasWidth * 0.775,
      top: canvasHeight * 0.77,
      fontSize: isLandscape ? 18 : 16,
      fontFamily: 'Arial',
      fill: '#666666',
      originX: 'center',
      originY: 'center',
      selectable: false
    });
    
    theirPriceText = new Text(signageData.theirPrice, {
      left: canvasWidth * 0.775,
      top: canvasHeight * 0.83,
      fontSize: isLandscape ? 24 : 20,
      fontWeight: 'bold',
      fontFamily: 'Arial',
      fill: '#666666',
      originX: 'center',
      originY: 'center',
      selectable: false
    });
  }
  
  // Add objects to canvas
  canvas.add(saleTypeRect);
  canvas.add(saleTypeText);
  canvas.add(priceText);
  canvas.add(descriptionText);
  
  if (theirPriceContainer && theirPriceText && theirPriceLabel) {
    canvas.add(theirPriceContainer);
    canvas.add(theirPriceLabel);
    canvas.add(theirPriceText);
  }
  
  // Logo or store branding
  const logoText = new Text('YOUR STORE', {
    left: canvasWidth / 2,
    top: canvasHeight * 0.9,
    fontSize: isLandscape ? 28 : 24,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fill: '#2a8636',
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  canvas.add(logoText);
  canvas.renderAll();
};
