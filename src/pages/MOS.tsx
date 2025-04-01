
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Download, Trash2, Package, Search } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarcodeScanner } from "@/components/BarcodeScanner";

interface MOSItem {
  id: string;
  code: string;
  quantity: number;
  reason: string;
  timestamp: Date;
}

const MOS = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [mosItems, setMOSItems] = useState<MOSItem[]>([]);
  const [activeTab, setActiveTab] = useState("scan");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("to bins");
  const { toast } = useToast();

  const handleScan = (result: string) => {
    // Code should be exactly 5 digits
    const code = result.substring(0, 5);
    setCurrentCode(code);
    setShowScanner(false);
    toast({
      title: "QR Code Scanned",
      description: `Code detected: ${code}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCode) {
      toast({
        title: "Error",
        description: "Please scan a QR code first",
        variant: "destructive",
      });
      return;
    }

    const newItem: MOSItem = {
      id: crypto.randomUUID(),
      code: currentCode,
      quantity,
      reason,
      timestamp: new Date(),
    };

    setMOSItems(prev => [newItem, ...prev]);
    toast({
      title: "Item Added",
      description: `Added ${quantity} units with code ${currentCode}`,
    });

    // Reset form
    setCurrentCode("");
    setQuantity(1);
  };

  const handleExport = () => {
    if (mosItems.length === 0) {
      toast({
        title: "No Data",
        description: "There are no items to export",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ["Code", "Quantity", "Reason", "Timestamp"];
    const rows = mosItems.map(item => [
      item.code,
      item.quantity.toString(),
      item.reason,
      item.timestamp.toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mos-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Report has been downloaded",
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Filter items based on search query
  const filteredItems = mosItems.filter(item => 
    item.code.includes(searchQuery) || 
    item.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear all items
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all items?")) {
      setMOSItems([]);
      toast({
        title: "Items Cleared",
        description: "All items have been removed",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-[#2a8636] p-4 sm:p-6 rounded-xl shadow-sm w-full">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-0 font-['Luckiest_Guy']">
          MOS Scanner
        </h1>
        <img 
          src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" 
          alt="Header Logo" 
          className="h-24 sm:h-32 md:h-48 w-auto" 
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-2 bg-[#2a8636]/20">
          <TabsTrigger value="scan" className="data-[state=active]:bg-[#2a8636] data-[state=active]:text-white">
            Scan & Add
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-[#2a8636] data-[state=active]:text-white">
            Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Add MOS Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center mb-4">
                  <Button 
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="w-full flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    Scan QR Code
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    SAP item #
                  </label>
                  <Input
                    id="code"
                    value={currentCode}
                    onChange={(e) => setCurrentCode(e.target.value.substring(0, 5))}
                    placeholder="Enter code or scan QR"
                    className="w-full"
                    maxLength={5}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      className="h-10 w-10"
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="mx-2 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      className="h-10 w-10"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="text-sm font-medium">
                    Removal Reason
                  </label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to bins">To Bins</SelectItem>
                      <SelectItem value="trash">Trash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={!currentCode}>
                  Add Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:w-1/2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by code or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleExport}
                  disabled={mosItems.length === 0}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button
                  onClick={handleClearAll}
                  disabled={mosItems.length === 0}
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
                      <TableHead>Date & Time</TableHead>
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
                            <div className="flex items-center">
                              {item.reason === "to bins" ? (
                                <Package className="h-4 w-4 mr-2" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              {item.reason}
                            </div>
                          </TableCell>
                          <TableCell>{item.timestamp.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default MOS;
