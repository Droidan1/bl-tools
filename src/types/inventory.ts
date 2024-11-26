export interface InventoryItem {
  id: string;
  sapNumber: string;
  quantity: number;
  barcode?: string;
  timestamp: Date;
}