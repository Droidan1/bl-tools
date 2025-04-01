
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BarcodeScanner } from "@/components/BarcodeScanner";

const MOS = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const { toast } = useToast();

  const handleScan = (result: string) => {
    if (!scannedCodes.includes(result)) {
      setScannedCodes((prev) => [...prev, result]);
      toast({
        title: "QR Code Scanned",
        description: `Successfully recorded: ${result}`,
      });
    } else {
      toast({
        title: "Duplicate QR Code",
        description: "This QR code has already been scanned",
        variant: "destructive",
      });
    }
    setShowScanner(false);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">MOS QR Code Scanner</h1>
      
      <div className="flex flex-col gap-4 mb-8">
        <Button 
          onClick={() => setShowScanner(true)}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          Scan QR Code
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Scanned Codes</h2>
        {scannedCodes.length === 0 ? (
          <p className="text-gray-500">No QR codes have been scanned yet.</p>
        ) : (
          <ul className="space-y-2">
            {scannedCodes.map((code, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-md">
                {code}
              </li>
            ))}
          </ul>
        )}
      </div>

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
