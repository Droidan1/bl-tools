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

    // Extract "# of Units:" pattern first
    const unitsMatch = cleanLine.match(/#\s*of\s*units\s*:\s*(\d+)/i);
    if (unitsMatch) {
      console.log('Found # of Units match:', unitsMatch[1]);
      fields.quantity = parseInt(unitsMatch[1], 10);
    }

    // Extract "Item:" pattern
    const itemMatch = cleanLine.match(/item\s*:\s*(\d+)/i);
    if (itemMatch) {
      console.log('Found Item match:', itemMatch[1]);
      fields.sapNumber = itemMatch[1];
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
  if (!fields.quantity || !fields.sapNumber) {
    const fullText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    
    // Fallback for # of Units
    if (!fields.quantity) {
      const unitsMatch = fullText.match(/#\s*of\s*units\s*:\s*(\d+)/i);
      if (unitsMatch) {
        console.log('Found # of Units from fulltext:', unitsMatch[1]);
        fields.quantity = parseInt(unitsMatch[1], 10);
      }
    }

    // Fallback for Item
    if (!fields.sapNumber) {
      const itemMatch = fullText.match(/item\s*:\s*(\d+)/i);
      if (itemMatch) {
        console.log('Found Item from fulltext:', itemMatch[1]);
        fields.sapNumber = itemMatch[1];
      }
    }
  }

  console.log('Final extracted fields:', fields);
  return fields;
};