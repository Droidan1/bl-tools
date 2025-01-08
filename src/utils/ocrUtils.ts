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
    // Look for SAP number patterns after "Item" or "Item #" or "Item Number"
    // Also look for standalone numbers that match the pattern P-XXXXXX-XXXXXX
    if (line.toLowerCase().includes('item:')) {
      const itemMatch = line.match(/Item:\s*(\d+)/i);
      if (itemMatch) {
        fields.sapNumber = itemMatch[1];
      }
    } else if (line.match(/P-\d{6}-\d{6}/)) {
      // Extract the middle 6 digits from P-XXXXXX-XXXXXX pattern
      const match = line.match(/P-(\d{6})-\d{6}/);
      if (match) {
        fields.sapNumber = match[1];
      }
    }
    
    // Look for barcode (any sequence of digits and letters)
    if (/\b[A-Z0-9]{8,}\b/i.test(line)) {
      fields.barcode = line.match(/\b[A-Z0-9]{8,}\b/i)?.[0];
    }
    
    // Look for store location (typically starts with "Store" or contains "Location")
    if (line.toLowerCase().includes('store') || line.toLowerCase().includes('location')) {
      fields.storeLocation = line.trim();
    }
    
    // Look for BOL number (typically starts with "BOL" or contains "Bill of Lading")
    if (line.toLowerCase().includes('bol') || line.toLowerCase().includes('bill of lading')) {
      fields.bolNumber = line.match(/\b[A-Z0-9-]{4,}\b/i)?.[0];
    }
  });

  // Log the extracted fields for debugging
  console.log('Extracted fields:', fields);
  console.log('Original text:', text);

  return fields;
};