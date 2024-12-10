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
    // Look for SAP number (typically 6-8 digits)
    if (/\b\d{6,8}\b/.test(line)) {
      fields.sapNumber = line.match(/\b\d{6,8}\b/)?.[0];
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

  return fields;
};