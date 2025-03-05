
import { Canvas, Text, Rect, Group, ITextOptions } from "fabric";
import { SignageData } from "@/types/signage";

// Common styles for different sale types
const saleTypeStyles = {
  'Sale': {
    bgColor: '#3BB54A',
    textColor: '#FFFFFF',
  },
  'Clearance': {
    bgColor: '#f97316',
    textColor: '#FFFFFF',
  },
  'Wow Deal': {
    bgColor: '#8b5cf6',
    textColor: '#FFFFFF',
  },
  'New Arrival': {
    bgColor: '#0ea5e9',
    textColor: '#FFFFFF',
  },
  'Blow Out': {
    bgColor: '#dc2626',
    textColor: '#FFFFFF',
  }
};

export const renderSignageTemplate = (canvas: Canvas, signageData: SignageData) => {
  // Clear any existing objects
  canvas.clear();
  
  const isLandscape = signageData.dimensions === "11 in x 8.5 in";
  
  // Set dimensions for canvas
  const canvasWidth = canvas.getWidth() || (isLandscape ? 550 : 425);
  const canvasHeight = canvas.getHeight() || (isLandscape ? 425 : 550);
  
  // Add white background with green border
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
  canvas.add(background);

  // Add the BARGAIN LANE logo on top left
  const logoTextShop = new Text("SHOP RETAIL, PALLETS, BINS & MORE", {
    left: 130,
    top: 33,
    fontSize: isLandscape ? 12 : 10,
    fontFamily: 'Arial',
    fontWeight: '400',
    fill: '#3BB54A',
    originX: 'left',
    originY: 'center',
    selectable: false
  });
  
  const logoTextMain = new Text("BARGAIN LANE", {
    left: 130,
    top: 65,
    fontSize: isLandscape ? 30 : 24,
    fontFamily: 'Impact, Arial',
    fontWeight: 'bold',
    fill: '#3BB54A',
    originX: 'left',
    originY: 'center',
    selectable: false
  });
  
  // Add dollar sign circle logo
  const logoCircle = new Rect({
    left: 65,
    top: 65,
    width: 60,
    height: 60,
    rx: 30,
    ry: 30,
    fill: '#3BB54A',
    selectable: false
  });
  
  const dollarSign = new Text("$", {
    left: 65,
    top: 65,
    fontSize: isLandscape ? 36 : 30,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: '#FFFFFF',
    originX: 'center',
    originY: 'center',
    selectable: false
  });

  // Add sale type background in top right
  const saleStyle = saleTypeStyles[signageData.saleType as keyof typeof saleTypeStyles] || saleTypeStyles.Sale;
  
  const saleTypeRect = new Rect({
    left: canvasWidth - canvasWidth * 0.3,
    top: 0,
    width: canvasWidth * 0.3,
    height: canvasHeight * 0.15,
    fill: saleStyle.bgColor,
    selectable: false
  });
  
  const saleTypeText = new Text("SALE TYPE", {
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
  
  // Dollar sign for price
  const priceDollarSign = new Text("$", {
    left: canvasWidth * 0.3,
    top: canvasHeight * 0.4,
    fontSize: isLandscape ? 48 : 40,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fill: '#000000',
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  // Price display - very large
  const priceText = new Text(signageData.price || '10', {
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
  
  // Green bottom bar for product description
  const descriptionRect = new Rect({
    left: canvasWidth * 0.1,
    top: canvasHeight * 0.7,
    width: canvasWidth * 0.8,
    height: canvasHeight * 0.15,
    fill: '#3BB54A',
    selectable: false
  });
  
  // Product description on green bar
  const descriptionText = new Text(signageData.productDescription.toUpperCase() || 'PRODUCT DESCRIPTION', {
    left: canvasWidth * 0.5,
    top: canvasHeight * 0.775,
    fontSize: isLandscape ? 36 : 30,
    fontWeight: 'bold',
    fontFamily: 'Impact, Arial',
    textAlign: 'center',
    fill: '#FFFFFF',
    width: canvasWidth * 0.7,
    originX: 'center',
    originY: 'center',
    selectable: false
  });
  
  // Their price box (comparison)
  let theirPriceContainer = null;
  let theirPriceLabel = null;
  let theirPriceText = null;
  let theirPriceDollar = null;
  
  if (signageData.theirPrice) {
    theirPriceContainer = new Rect({
      left: canvasWidth * 0.75,
      top: canvasHeight * 0.45,
      width: canvasWidth * 0.2,
      height: canvasWidth * 0.2,
      fill: '#3BB54A',
      selectable: false
    });
    
    theirPriceLabel = new Text("THEIR PRICE", {
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
    
    theirPriceDollar = new Text("$", {
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
    
    theirPriceText = new Text(signageData.theirPrice, {
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
  }
  
  // Add all objects to canvas
  canvas.add(logoCircle);
  canvas.add(dollarSign);
  canvas.add(logoTextShop);
  canvas.add(logoTextMain);
  canvas.add(saleTypeRect);
  canvas.add(saleTypeText);
  canvas.add(priceDollarSign);
  canvas.add(priceText);
  canvas.add(descriptionRect);
  canvas.add(descriptionText);
  
  if (theirPriceContainer && theirPriceLabel && theirPriceText && theirPriceDollar) {
    canvas.add(theirPriceContainer);
    canvas.add(theirPriceLabel);
    canvas.add(theirPriceDollar);
    canvas.add(theirPriceText);
  }
  
  canvas.renderAll();
};
