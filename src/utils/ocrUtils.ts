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

  // Process the entire text first for more flexible matching
  const fullText = text.replace(/\s+/g, ' ').toLowerCase();

  // More flexible SAP number matching
  const itemMatches = fullText.match(/item:?\s*#?\s*(\d+)/i) || 
                     fullText.match(/item\s+number:?\s*#?\s*(\d+)/i) ||
                     fullText.match(/sap:?\s*#?\s*(\d+)/i);
  if (itemMatches) {
    console.log('Found SAP number match:', itemMatches[1]);
    fields.sapNumber = itemMatches[1];
  }

  // More flexible barcode matching
  const barcodeMatches = text.match(/P-\d{6}-\d{6}/i) ||
                        text.match(/P\s*-\s*\d{6}\s*-\s*\d{6}/i);
  if (barcodeMatches) {
    console.log('Found barcode match:', barcodeMatches[0]);
    fields.barcode = barcodeMatches[0].replace(/\s+/g, '');
  }

  // More flexible quantity matching
  const quantityMatches = fullText.match(/#\s*of\s*units:?\s*(\d+)/i) ||
                         fullText.match(/units:?\s*(\d+)/i) ||
                         fullText.match(/quantity:?\s*(\d+)/i) ||
                         fullText.match(/qty:?\s*(\d+)/i);
  if (quantityMatches) {
    console.log('Found quantity match:', quantityMatches[1]);
    fields.quantity = parseInt(quantityMatches[1], 10);
  }

  // Process line by line for specific formats
  lines.forEach(line => {
    const cleanLine = line.trim().toLowerCase();
    
    // Additional SAP number patterns
    if (!fields.sapNumber) {
      const sapMatch = cleanLine.match(/^(\d{5,6})$/);
      if (sapMatch) {
        console.log('Found potential SAP number from standalone digits:', sapMatch[1]);
        fields.sapNumber = sapMatch[1];
      }
    }
  });

  console.log('Extracted fields:', fields);
  return fields;
};