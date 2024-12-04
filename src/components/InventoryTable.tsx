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
            <TableHead className="whitespace-nowrap text-white">Store Location</TableHead>
            <TableHead className="whitespace-nowrap text-white">BOL #</TableHead>
            <TableHead className="whitespace-nowrap text-white">SAP Item #</TableHead>
            <TableHead className="whitespace-nowrap text-white">Quantity</TableHead>
            <TableHead className="whitespace-nowrap text-white">Barcode</TableHead>
            <TableHead className="whitespace-nowrap text-white">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium whitespace-nowrap text-white">{item.storeLocation}</TableCell>
              <TableCell className="whitespace-nowrap text-white">{item.bolNumber || '-'}</TableCell>
              <TableCell className="whitespace-nowrap text-white">{item.sapNumber}</TableCell>
              <TableCell className="whitespace-nowrap text-white">{item.quantity}</TableCell>
              <TableCell className="whitespace-nowrap text-white">{item.barcode || '-'}</TableCell>
              <TableCell className="whitespace-nowrap text-white">{item.timestamp.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-white">
                No items added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};