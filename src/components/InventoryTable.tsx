import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InventoryItem } from '@/types/inventory';

interface InventoryTableProps {
  items: InventoryItem[];
}

export const InventoryTable = ({ items }: InventoryTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Location</TableHead>
            <TableHead>SAP Item #</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.storeLocation}</TableCell>
              <TableCell>{item.sapNumber}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.barcode || '-'}</TableCell>
              <TableCell>{item.timestamp.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No items added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};