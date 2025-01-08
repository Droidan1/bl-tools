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

  lines.forEach(line => {
    // Look for "Item: XXXXX" format for SAP number with more flexible matching
    const itemRegex = /item:?\s*(\d+)/i;
    if (itemRegex.test(line)) {
      const itemMatch = line.match(itemRegex);
      if (itemMatch) {
        console.log('Found SAP number match:', itemMatch[1], 'in line:', line);
        fields.sapNumber = itemMatch[1];
      }
    }
    
    // Look for P-XXXXXX-XXXXXX format for barcode with more flexible matching
    const barcodeRegex = /P-\d{6}-\d{6}/i;
    const barcodeMatch = line.match(barcodeRegex);
    if (barcodeMatch) {
      console.log('Found barcode match:', barcodeMatch[0], 'in line:', line);
      fields.barcode = barcodeMatch[0];
    }

    // Look for "# of Units:" format for quantity
    const quantityRegex = /#\s*of\s*units:?\s*(\d+)/i;
    if (quantityRegex.test(line)) {
      const quantityMatch = line.match(quantityRegex);
      if (quantityMatch) {
        console.log('Found quantity match:', quantityMatch[1], 'in line:', line);
        fields.quantity = parseInt(quantityMatch[1], 10);
      }
    }
  });

  // Log the extracted fields for debugging
  console.log('Original text:', text);
  console.log('Extracted fields:', fields);

  return fields;
};