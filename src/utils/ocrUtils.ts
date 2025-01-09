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

    // Extract SAP number specifically after "I:" or "Item:"
    const sapMatch = cleanLine.match(/(?:I:|Item:)\s*(\d{5,6})/i);
    if (sapMatch) {
      console.log('Found SAP match:', sapMatch[1]);
      fields.sapNumber = sapMatch[1];
    }

    // Enhanced PRM and P- barcode pattern matching
    const prmPattern = /PRM[-\s]*(\d+)[-\s]*(\d+)/i;
    const pPattern = /P[-\s]*(\d+)[-\s]*(\d+)/i;
    
    const prmMatch = cleanLine.match(prmPattern);
    const pMatch = cleanLine.match(pPattern);
    
    if (prmMatch) {
      const formattedBarcode = `PRM-${prmMatch[1]}-${prmMatch[2]}`;
      console.log('Found PRM barcode match:', formattedBarcode);
      fields.barcode = formattedBarcode;
    } else if (pMatch) {
      const formattedBarcode = `P-${pMatch[1]}-${pMatch[2]}`;
      console.log('Found P- barcode match:', formattedBarcode);
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

    // Fallback for SAP number specifically after "I:" or "Item:"
    if (!fields.sapNumber) {
      const sapMatch = fullText.match(/(?:I:|Item:)\s*(\d{5,6})/i);
      if (sapMatch) {
        console.log('Found SAP from fulltext:', sapMatch[1]);
        fields.sapNumber = sapMatch[1];
      }
    }

    // Fallback for barcodes
    if (!fields.barcode) {
      const prmMatch = fullText.match(/PRM[-\s]*(\d+)[-\s]*(\d+)/i);
      const pMatch = fullText.match(/P[-\s]*(\d+)[-\s]*(\d+)/i);
      
      if (prmMatch) {
        const formattedBarcode = `PRM-${prmMatch[1]}-${prmMatch[2]}`;
        console.log('Found PRM barcode from fulltext:', formattedBarcode);
        fields.barcode = formattedBarcode;
      } else if (pMatch) {
        const formattedBarcode = `P-${pMatch[1]}-${pMatch[2]}`;
        console.log('Found P- barcode from fulltext:', formattedBarcode);
        fields.barcode = formattedBarcode;
      }
    }
  }

  console.log('Final extracted fields:', fields);
  return fields;
};