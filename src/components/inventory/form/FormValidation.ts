export const isFormValid = (sapNumber: string, barcode: string, storeLocation: string) => {
  return Boolean(
    sapNumber?.trim() && 
    barcode?.trim() &&
    storeLocation?.trim()
  );
};