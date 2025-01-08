interface ExtractedFields {
  sapNumber?: string;
  barcode?: string;
  storeLocation?: string;
  bolNumber?: string;
}

export const extractFieldsFromText = (text: string): ExtractedFields => {
  const lines = text.split('\n');
  const fields: ExtractedFields = {};

  lines.forEach(line => {
    // Look for "Item: XXXXX" format for SAP number
    if (line.toLowerCase().includes('item:')) {
      const itemMatch = line.match(/Item:\s*(\d+)/i);
      if (itemMatch) {
        fields.sapNumber = itemMatch[1];
      }
    }
    
    // Look for P-XXXXXX-XXXXXX format for barcode
    const barcodeMatch = line.match(/P-\d{6}-\d{6}/);
    if (barcodeMatch) {
      fields.barcode = barcodeMatch[0];
    }
  });

  // Log the extracted fields for debugging
  console.log('Original text:', text);
  console.log('Extracted fields:', fields);

  return fields;
};