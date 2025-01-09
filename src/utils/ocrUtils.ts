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

  // Process each line for exact matches
  lines.forEach(line => {
    const cleanLine = line.trim();
    console.log('Processing line:', cleanLine);

    // Extract quantity with more flexible pattern matching
    const unitsMatch = cleanLine.match(/^#\s*[0O]?\s*U\s*:\s*(\d+)$/i) || 
                      cleanLine.match(/#\s*[0O]?\s*of\s*units\s*:\s*(\d+)/i) ||
                      cleanLine.match(/units\s*:\s*(\d+)/i);
    if (unitsMatch) {
      console.log('Found Units match:', unitsMatch[1]);
      fields.quantity = parseInt(unitsMatch[1], 10);
    }

    // Extract SAP number with more flexible pattern matching
    const sapMatch = cleanLine.match(/(?:I:|Item:|CL|:)\s*(\d{5,6})/i) ||
                    cleanLine.match(/^(\d{5,6})$/);
    if (sapMatch) {
      console.log('Found SAP match:', sapMatch[1]);
      fields.sapNumber = sapMatch[1];
    }

    // Enhanced PRM barcode pattern matching without zero padding
    const prmPattern = /PRM[-\s]*(\d+)[-\s]*(\d+)/i;
    const barcodeMatch = cleanLine.match(prmPattern);
    if (barcodeMatch) {
      // Keep exact digits without padding
      const formattedBarcode = `PRM-${barcodeMatch[1]}-${barcodeMatch[2]}`;
      console.log('Found barcode match:', formattedBarcode);
      fields.barcode = formattedBarcode;
    }
  });

  // Second pass: Process the entire text as one string for cases where line breaks might interfere
  if (!fields.quantity || !fields.sapNumber || !fields.barcode) {
    const fullText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    
    // Fallback for units with more flexible pattern
    if (!fields.quantity) {
      const unitsMatch = fullText.match(/#\s*[0O]?\s*U\s*:\s*(\d+)/i) ||
                        fullText.match(/#\s*[0O]?\s*of\s*units\s*:\s*(\d+)/i) ||
                        fullText.match(/units\s*:\s*(\d+)/i);
      if (unitsMatch) {
        console.log('Found Units from fulltext:', unitsMatch[1]);
        fields.quantity = parseInt(unitsMatch[1], 10);
      }
    }

    // Fallback for SAP number
    if (!fields.sapNumber) {
      const sapMatch = fullText.match(/(?:I:|Item:|CL|:)\s*(\d{5,6})/i) ||
                      fullText.match(/\b(\d{5,6})\b/);
      if (sapMatch) {
        console.log('Found SAP from fulltext:', sapMatch[1]);
        fields.sapNumber = sapMatch[1];
      }
    }

    // Fallback for PRM barcode without padding
    if (!fields.barcode) {
      const prmPattern = /PRM[-\s]*(\d+)[-\s]*(\d+)/i;
      const barcodeMatch = fullText.match(prmPattern);
      if (barcodeMatch) {
        const formattedBarcode = `PRM-${barcodeMatch[1]}-${barcodeMatch[2]}`;
        console.log('Found barcode from fulltext:', formattedBarcode);
        fields.barcode = formattedBarcode;
      }
    }
  }

  console.log('Final extracted fields:', fields);
  return fields;
};
