import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { InventoryItem } from '@/types/inventory';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
}

export const InventoryTable = ({ items, onEdit }: InventoryTableProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Photo</TableHead>
            <TableHead className="whitespace-nowrap">Store Location</TableHead>
            <TableHead className="whitespace-nowrap">BOL #</TableHead>
            <TableHead className="whitespace-nowrap">SAP Item #</TableHead>
            <TableHead className="whitespace-nowrap">Quantity</TableHead>
            <TableHead className="whitespace-nowrap">Barcode</TableHead>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.photoUrl && (
                  <img 
                    src={item.photoUrl} 
                    alt="Item" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
              </TableCell>
              <TableCell className="font-medium whitespace-nowrap">{item.storeLocation}</TableCell>
              <TableCell className="whitespace-nowrap">{item.bolNumber || '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.sapNumber}</TableCell>
              <TableCell className="whitespace-nowrap">{item.quantity}</TableCell>
              <TableCell className="whitespace-nowrap">{item.barcode || '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.timestamp.toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No items added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};