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
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Store Location</TableHead>
            <TableHead className="whitespace-nowrap">BOL #</TableHead>
            <TableHead className="whitespace-nowrap">SAP Item #</TableHead>
            <TableHead className="whitespace-nowrap">Quantity</TableHead>
            <TableHead className="whitespace-nowrap">Barcode</TableHead>
            <TableHead className="whitespace-nowrap">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium whitespace-nowrap">{item.storeLocation}</TableCell>
              <TableCell className="whitespace-nowrap">{item.bolNumber || '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.sapNumber}</TableCell>
              <TableCell className="whitespace-nowrap">{item.quantity}</TableCell>
              <TableCell className="whitespace-nowrap">{item.barcode || '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.timestamp.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No items added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};