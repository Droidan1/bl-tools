export const isFormValid = (sapNumber: string, barcode: string, storeLocation: string) => {
  return Boolean(
    sapNumber && sapNumber.trim().length > 0 && 
    barcode && barcode.trim().length > 0 &&
    storeLocation && storeLocation.trim().length > 0
  );
};