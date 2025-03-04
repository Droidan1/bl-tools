
interface ExtractedFields {
  sapNumber?: string;
  barcode?: string;
  storeLocation?: string;
  bolNumber?: string;
  quantity?: number;
}

// Common OCR substitution map for error correction
const ocrSubstitutions: Record<string, string> = {
  'O': '0',
  'o': '0',
  'I': '1',
  'l': '1',
  'Z': '2',
  'S': '5',
  'B': '8',
  'RRM': 'PRM',
  'PRH': 'PRM',
  'P-RM': 'PRM',
  'P.': 'P-',
  'P,': 'P-',
};

// Preprocess text to correct common OCR errors
const preprocessText = (text: string): string => {
  let processedText = text;
  
  // Apply character substitutions
  Object.entries(ocrSubstitutions).forEach(([error, correction]) => {
    processedText = processedText.replace(new RegExp(error, 'g'), correction);
  });
  
  // Normalize whitespace
  processedText = processedText.replace(/\s+/g, ' ').trim();
  
  // Handle rotated text by looking for keywords in different orientations
  const keywords = ['PRM', 'ITEM', 'UNITS', 'SAP'];
  const lines = text.split('\n');
  
  // Check if key identifiers are missing, which might indicate rotated text
  if (!keywords.some(keyword => processedText.toUpperCase().includes(keyword))) {
    // Try to detect and correct rotated text by examining line lengths and patterns
    const potentialRotated = lines.filter(line => line.length > 15).join(' ');
    if (potentialRotated && keywords.some(keyword => potentialRotated.toUpperCase().includes(keyword))) {
      processedText += ' ' + potentialRotated;
    }
  }
  
  return processedText;
};

// Fuzzy matching helper function
const fuzzyMatch = (text: string, pattern: string, threshold = 0.8): boolean => {
  if (!text || !pattern) return false;
  
  // Simple fuzzy matching based on character overlap
  let matches = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (text.includes(pattern[i])) matches++;
  }
  
  return matches / pattern.length >= threshold;
};

export const extractFieldsFromText = (text: string): ExtractedFields => {
  const originalText = text;
  text = preprocessText(text);
  const lines = text.split('\n');
  const fields: ExtractedFields = {};

  console.log('Original text:', originalText);
  console.log('Processed text:', text);
  console.log('Split into lines:', lines);

  // Define barcode patterns here so they're accessible throughout the function
  const prmPatterns = [
    /PRM[-\s]*(\d+)[-\s]*(\d+)/i,
    /P(?:RM|RH)[-.\s]*(\d+)[-.\s]*(\d+)/i,
    /(?:PR|RP|RR)[-.\s]*(\d+)[-.\s]*(\d+)/i
  ];
  
  const pPatterns = [
    /P[-\s]*(\d+)[-\s]*(\d+)/i,
    /P[-.\s,]*(\d+)[-.\s,]*(\d+)/i
  ];

  // Process each line for exact and fuzzy matches
  lines.forEach(line => {
    const cleanLine = line.trim();
    console.log('Processing line:', cleanLine);

    // Extract quantity with more flexible pattern matching
    const unitsMatch = cleanLine.match(/^#\s*[0O]?\s*U\s*:\s*(\d+)$/i) || 
                      cleanLine.match(/#\s*[0O]?\s*of\s*units\s*:\s*(\d+)/i) ||
                      cleanLine.match(/units\s*:\s*(\d+)/i) ||
                      cleanLine.match(/quantity\s*:\s*(\d+)/i) ||
                      cleanLine.match(/qty\s*:?\s*(\d+)/i) ||
                      cleanLine.match(/^\s*(\d+)\s*(?:units|pcs|pieces|count)\s*$/i);
    
    if (unitsMatch) {
      console.log('Found Units match:', unitsMatch[1]);
      fields.quantity = parseInt(unitsMatch[1], 10);
    }

    // Extract SAP number with more flexible pattern matching
    const sapMatch = cleanLine.match(/(?:I:|Item:|SAP|Item\s*#|Item\s*No|Item\s*Number)[:.\s-]*(\d{4,7})/i) || 
                     cleanLine.match(/(\d{5,6})(?:\s*-\s*SAP|\s*SAP)/i);
    
    if (sapMatch) {
      console.log('Found SAP match:', sapMatch[1]);
      fields.sapNumber = sapMatch[1];
    }

    // Enhanced barcode pattern matching with fuzzy matching
    // Try all PRM patterns
    for (const pattern of prmPatterns) {
      const match = cleanLine.match(pattern);
      if (match) {
        const formattedBarcode = `PRM-${match[1]}-${match[2]}`;
        console.log('Found PRM barcode match:', formattedBarcode);
        fields.barcode = formattedBarcode;
        break;
      }
    }
    
    // If no PRM match, try P- patterns
    if (!fields.barcode) {
      for (const pattern of pPatterns) {
        const match = cleanLine.match(pattern);
        if (match) {
          const formattedBarcode = `P-${match[1]}-${match[2]}`;
          console.log('Found P- barcode match:', formattedBarcode);
          fields.barcode = formattedBarcode;
          break;
        }
      }
    }
    
    // Try fuzzy matching for barcodes if still not found
    if (!fields.barcode && (fuzzyMatch(cleanLine.toUpperCase(), 'PRM') || cleanLine.includes('P-'))) {
      console.log('Attempting fuzzy barcode matching for:', cleanLine);
      
      // Extract numbers from the line
      const numbers = cleanLine.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        if (fuzzyMatch(cleanLine.toUpperCase(), 'PRM')) {
          fields.barcode = `PRM-${numbers[0]}-${numbers[1]}`;
          console.log('Fuzzy matched PRM barcode:', fields.barcode);
        } else {
          fields.barcode = `P-${numbers[0]}-${numbers[1]}`;
          console.log('Fuzzy matched P- barcode:', fields.barcode);
        }
      }
    }
  });

  // Second pass: Process the entire text as one string for cases where line breaks might interfere
  if (!fields.quantity || !fields.sapNumber || !fields.barcode) {
    const fullText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    
    // Fallback for units with more flexible pattern
    if (!fields.quantity) {
      const unitsMatch = fullText.match(/#\s*[0O]?\s*U\s*:\s*(\d+)/i) ||
                        fullText.match(/#\s*[0O]?\s*of\s*units\s*:\s*(\d+)/i) ||
                        fullText.match(/units\s*:\s*(\d+)/i) ||
                        fullText.match(/quantity\s*:\s*(\d+)/i) ||
                        fullText.match(/qty\s*:?\s*(\d+)/i) ||
                        fullText.match(/(\d+)\s*(?:units|pcs|pieces|count)/i);
      
      if (unitsMatch) {
        console.log('Found Units from fulltext:', unitsMatch[1]);
        fields.quantity = parseInt(unitsMatch[1], 10);
      }
    }

    // Fallback for SAP number with more flexible pattern
    if (!fields.sapNumber) {
      const sapMatch = fullText.match(/(?:I:|Item:|SAP|Item\s*#|Item\s*No|Item\s*Number)[:.\s-]*(\d{4,7})/i) || 
                       fullText.match(/(\d{5,6})(?:\s*-\s*SAP|\s*SAP)/i);
      
      if (sapMatch) {
        console.log('Found SAP from fulltext:', sapMatch[1]);
        fields.sapNumber = sapMatch[1];
      } else {
        // Last resort: look for 5-6 digit numbers that might be SAP numbers
        const potentialSapNumbers = fullText.match(/\b\d{5,6}\b/g);
        if (potentialSapNumbers && potentialSapNumbers.length > 0) {
          // Use the first 5-6 digit number as a potential SAP number
          fields.sapNumber = potentialSapNumbers[0];
          console.log('Found potential SAP from digit pattern:', fields.sapNumber);
        }
      }
    }

    // Fallback for barcodes with more pattern variations
    if (!fields.barcode) {
      // Try all PRM patterns in fulltext
      for (const pattern of prmPatterns) {
        const match = fullText.match(pattern);
        if (match) {
          fields.barcode = `PRM-${match[1]}-${match[2]}`;
          console.log('Found PRM barcode from fulltext:', fields.barcode);
          break;
        }
      }
      
      // If still no match, try P- patterns
      if (!fields.barcode) {
        for (const pattern of pPatterns) {
          const match = fullText.match(pattern);
          if (match) {
            fields.barcode = `P-${match[1]}-${match[2]}`;
            console.log('Found P- barcode from fulltext:', fields.barcode);
            break;
          }
        }
      }
      
      // Last resort: Extract any two numbers that might form a barcode
      if (!fields.barcode) {
        const numbers = fullText.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          // Determine format based on text content
          if (fullText.toUpperCase().includes('PRM') || fullText.toUpperCase().includes('PR') || fullText.toUpperCase().includes('RM')) {
            fields.barcode = `PRM-${numbers[0]}-${numbers[1]}`;
            console.log('Extracted potential PRM barcode from numbers:', fields.barcode);
          } else {
            fields.barcode = `P-${numbers[0]}-${numbers[1]}`;
            console.log('Extracted potential P- barcode from numbers:', fields.barcode);
          }
        }
      }
    }
  }

  // Validate and format results
  if (fields.sapNumber) {
    // Ensure SAP number is properly formatted (just digits)
    fields.sapNumber = fields.sapNumber.replace(/\D/g, '');
  }

  console.log('Final extracted fields:', fields);
  return fields;
};
