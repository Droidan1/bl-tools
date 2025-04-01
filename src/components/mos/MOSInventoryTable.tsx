
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Trash2, Package, Search, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MOSItem } from "@/types/mos";

interface MOSInventoryTableProps {
  items: MOSItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExport: () => void;
  onClearAll: () => void;
  isLoading?: boolean;
}

export const MOSInventoryTable = ({
  items,
  searchQuery,
  setSearchQuery,
  onExport,
  onClearAll,
  isLoading = false
}: MOSInventoryTableProps) => {
  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.code.includes(searchQuery) || 
    item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.storeLocation && item.storeLocation.includes(searchQuery))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2a8636]" />
        <span className="ml-2 text-lg">Loading inventory data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-1/2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code, reason, or store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={onExport}
            disabled={items.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={onClearAll}
            disabled={items.length === 0}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {item.reason === "to bins" ? (
                          <Package className="h-4 w-4 mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        {item.reason}
                      </div>
                    </TableCell>
                    <TableCell>{item.storeLocation}</TableCell>
                    <TableCell>{item.timestamp.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
