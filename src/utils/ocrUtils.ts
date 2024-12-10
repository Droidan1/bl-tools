import { Document, SimpleNodeParser } from 'llamaindex';

export const findBarcodeInText = (text: string): string | undefined => {
  const lines = text.split('\n').map(line => 
    line.trim().replace(/\s+/g, '').toUpperCase()
  );
  
  const barcodePatterns = [
    /\d{12,14}/, // UPC/EAN (allowing partial matches)
    /[0-9A-Z]{8,14}/, // Code 39 (more flexible)
    /\d{8}/, // EAN-8
    /[0-9A-Z\-]{6,}/, // General alphanumeric codes
  ];

  // Create a LlamaIndex document from the text
  const document = new Document({ text });
  const parser = new SimpleNodeParser();
  const nodes = parser.getNodesFromDocument(document);

  // Look for patterns that might indicate text under a barcode
  for (const node of nodes) {
    const nodeText = node.text;
    
    // First try to find direct barcode matches
    for (const pattern of barcodePatterns) {
      const match = nodeText.match(pattern);
      if (match) {
        console.log('Found potential barcode:', match[0], 'in text:', nodeText);
        return match[0];
      }
    }

    // Look for text that appears to be under a barcode-like pattern
    const lines = nodeText.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      const currentLine = lines[i].trim();
      const nextLine = lines[i + 1].trim();
      
      // If current line matches barcode pattern and next line has text
      for (const pattern of barcodePatterns) {
        if (currentLine.match(pattern) && nextLine.length > 0) {
          console.log('Found text under barcode:', nextLine, 'under:', currentLine);
          return nextLine;
        }
      }
    }
  }

  // Fallback to looking for number sequences if no barcode pattern is found
  for (const node of nodes) {
    const numberSequence = node.text.match(/\d{6,}/);
    if (numberSequence) {
      console.log('Found number sequence as fallback:', numberSequence[0], 'in text:', node.text);
      return numberSequence[0];
    }
  }

  return undefined;
};

export const extractFieldsFromText = (text: string) => {
  const fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
  } = {};

  // Look for barcode and text under it
  const barcode = findBarcodeInText(text);
  if (barcode) {
    fields.barcode = barcode;
  }

  // Look for SAP number (assuming it's a number sequence)
  const sapPattern = /SAP[:\s]*(\d+)/i;
  const sapMatch = text.match(sapPattern);
  if (sapMatch) {
    fields.sapNumber = sapMatch[1];
  }

  // Look for store location (assuming it's prefixed with "Store" or "Location")
  const storePattern = /(store|location)[:\s]+([A-Za-z0-9\s]+)/i;
  const storeMatch = text.match(storePattern);
  if (storeMatch) {
    fields.storeLocation = storeMatch[2].trim();
  }

  // Look for BOL number
  const bolPattern = /BOL[:\s]*([A-Za-z0-9-]+)/i;
  const bolMatch = text.match(bolPattern);
  if (bolMatch) {
    fields.bolNumber = bolMatch[1];
  }

  return fields;
};