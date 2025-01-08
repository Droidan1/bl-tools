interface ExtractedFields {
  sapNumber?: string;
  barcode?: string;
  storeLocation?: string;
  bolNumber?: string;
  quantity?: number;
}

export const extractFieldsFromText = (text: string): ExtractedFields => {
  const lines = text.split('\n');
  const fields: ExtractedFields = {};

  console.log('Processing text:', text);
  console.log('Split into lines:', lines);

  // First pass: Process each line for exact matches
  lines.forEach(line => {
    const cleanLine = line.trim();
    console.log('Processing line:', cleanLine);

    // Extract Item/SAP number - checking multiple patterns
    const itemPatterns = [
      /item:?\s*#?\s*(\d+)/i,
      /item\s+number:?\s*#?\s*(\d+)/i,
      /sap:?\s*#?\s*(\d+)/i,
      /item\s*#:?\s*(\d+)/i
    ];

    for (const pattern of itemPatterns) {
      const match = cleanLine.match(pattern);
      if (match) {
        console.log('Found Item/SAP match:', match[1]);
        fields.sapNumber = match[1];
        break;
      }
    }

    // Extract Units/Quantity - checking multiple patterns
    const unitsPatterns = [
      /#\s*of\s*units:?\s*(\d+)/i,
      /units:?\s*(\d+)/i,
      /quantity:?\s*(\d+)/i,
      /qty:?\s*(\d+)/i,
      /(\d+)\s*units?/i
    ];

    for (const pattern of unitsPatterns) {
      const match = cleanLine.match(pattern);
      if (match) {
        console.log('Found Units/Quantity match:', match[1]);
        fields.quantity = parseInt(match[1], 10);
        break;
      }
    }

    // Extract Barcode
    const barcodeMatch = cleanLine.match(/P-\d{6}-\d{6}/i) ||
                        cleanLine.match(/P\s*-\s*\d{6}\s*-\s*\d{6}/i);
    if (barcodeMatch) {
      console.log('Found barcode match:', barcodeMatch[0]);
      fields.barcode = barcodeMatch[0].replace(/\s+/g, '');
    }
  });

  // Second pass: Process the entire text as one string for cases where line breaks might interfere
  const fullText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  
  // Fallback for Item/SAP number if not found in line-by-line processing
  if (!fields.sapNumber) {
    const itemMatch = fullText.match(/item:?\s*#?\s*(\d+)/i) ||
                     fullText.match(/item\s+number:?\s*#?\s*(\d+)/i) ||
                     fullText.match(/sap:?\s*#?\s*(\d+)/i);
    if (itemMatch) {
      console.log('Found Item/SAP from fulltext:', itemMatch[1]);
      fields.sapNumber = itemMatch[1];
    }
  }

  // Fallback for quantity if not found in line-by-line processing
  if (!fields.quantity) {
    const quantityMatch = fullText.match(/#\s*of\s*units:?\s*(\d+)/i) ||
                         fullText.match(/quantity:?\s*(\d+)/i) ||
                         fullText.match(/qty:?\s*(\d+)/i);
    if (quantityMatch) {
      console.log('Found quantity from fulltext:', quantityMatch[1]);
      fields.quantity = parseInt(quantityMatch[1], 10);
    }
  }

  console.log('Final extracted fields:', fields);
  return fields;
};