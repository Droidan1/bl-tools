export interface InventoryItem {
  id: string;
  sapNumber: string;
  quantity: number;
  barcode?: string;
  storeLocation: string;
  timestamp: Date;
}