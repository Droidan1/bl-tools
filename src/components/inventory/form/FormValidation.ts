export const isFormValid = (sapNumber: string, barcode: string, storeLocation: string): boolean => {
  const isValid = Boolean(
    sapNumber?.trim() && 
    barcode?.trim() && 
    storeLocation?.trim()
  );
  console.log('Form validation result:', { sapNumber, barcode, storeLocation, isValid });
  return isValid;
};