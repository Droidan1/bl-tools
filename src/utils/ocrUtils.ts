export const findBarcodeInText = (text: string): string | undefined => {
  const lines = text.split('\n').map(line => 
    line.trim().replace(/\s+/g, '').toUpperCase()
  );
  
  const barcodePatterns = [
    /\d{12,14}/, // UPC/EAN (allowing partial matches)
    /[0-9A-Z]{8,14}/, // Code 39 (more flexible)
    /\d{8}/, // EAN-8
    /[0-9A-Z\-]{6,}/, // General alphanumeric codes
  ];

  for (const line of lines) {
    for (const pattern of barcodePatterns) {
      const match = line.match(pattern);
      if (match) {
        const potentialBarcode = match[0];
        console.log('Found potential barcode:', potentialBarcode, 'in line:', line);
        return potentialBarcode;
      }
    }
  }

  for (const line of lines) {
    const numberSequence = line.match(/\d{6,}/);
    if (numberSequence) {
      console.log('Found number sequence as fallback:', numberSequence[0], 'in line:', line);
      return numberSequence[0];
    }
  }

  return undefined;
};