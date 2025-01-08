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

  // Process each line individually first
  lines.forEach(line => {
    const cleanLine = line.trim();
    console.log('Processing line:', cleanLine);

    // Look for "Item:" format
    const itemMatch = cleanLine.match(/item:?\s*#?\s*(\d+)/i) ||
                     cleanLine.match(/item\s+number:?\s*#?\s*(\d+)/i);
    if (itemMatch) {
      console.log('Found Item match:', itemMatch[1]);
      fields.sapNumber = itemMatch[1];
    }

    // Look for "# of Units:" format
    const unitsMatch = cleanLine.match(/#\s*of\s*units:?\s*(\d+)/i) ||
                      cleanLine.match(/units:?\s*(\d+)/i);
    if (unitsMatch) {
      console.log('Found Units match:', unitsMatch[1]);
      fields.quantity = parseInt(unitsMatch[1], 10);
    }

    // Look for P-XXXXXX-XXXXXX format for barcode
    const barcodeMatch = cleanLine.match(/P-\d{6}-\d{6}/i) ||
                        cleanLine.match(/P\s*-\s*\d{6}\s*-\s*\d{6}/i);
    if (barcodeMatch) {
      console.log('Found barcode match:', barcodeMatch[0]);
      fields.barcode = barcodeMatch[0].replace(/\s+/g, '');
    }

    // Look for standalone SAP numbers (as fallback)
    if (!fields.sapNumber) {
      const sapMatch = cleanLine.match(/^(\d{5,6})$/);
      if (sapMatch) {
        console.log('Found standalone SAP number:', sapMatch[1]);
        fields.sapNumber = sapMatch[1];
      }
    }
  });

  // Process the entire text as a single string for cases where line breaks might interfere
  const fullText = text.replace(/\s+/g, ' ');
  
  // Additional fallback patterns for quantity
  if (!fields.quantity) {
    const quantityMatch = fullText.match(/quantity:?\s*(\d+)/i) ||
                         fullText.match(/qty:?\s*(\d+)/i);
    if (quantityMatch) {
      console.log('Found quantity from fallback:', quantityMatch[1]);
      fields.quantity = parseInt(quantityMatch[1], 10);
    }
  }

  console.log('Final extracted fields:', fields);
  return fields;
};