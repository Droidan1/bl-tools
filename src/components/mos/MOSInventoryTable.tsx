
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Trash2, Package, Search, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MOSItem } from "@/types/mos";

interface MOSInventoryTableProps {
  items: MOSItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExport: () => void;
  onClearAll: () => void;
}

export const MOSInventoryTable = ({
  items,
  searchQuery,
  setSearchQuery,
  onExport,
  onClearAll
}: MOSInventoryTableProps) => {
  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.code.includes(searchQuery) || 
    item.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-between">
          <Button
            onClick={onExport}
            disabled={items.length === 0}
            className="flex items-center gap-2 flex-1 min-w-[130px]"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={onClearAll}
            disabled={items.length === 0}
            variant="destructive"
            className="flex items-center gap-2 flex-1 min-w-[130px]"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Code</TableHead>
                  <TableHead className="w-[80px]">Qty</TableHead>
                  <TableHead className="w-[100px]">Reason</TableHead>
                  <TableHead className="w-[140px]">Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center whitespace-nowrap">
                          {item.reason === "to bins" ? (
                            <Package className="h-4 w-4 mr-1 flex-shrink-0" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1 flex-shrink-0" />
                          )}
                          <span className="truncate">{item.reason}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 flex-shrink-0 md:hidden" />
                          <span>{new Date(item.timestamp).toLocaleString([], {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
