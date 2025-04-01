
import React from 'react';
import { MOSHeader } from "@/components/mos/MOSHeader";
import { MOSTabs } from "@/components/mos/MOSTabs";
import { MOSScannerModal } from "@/components/mos/MOSScannerModal";
import { useMOSState } from "@/hooks/useMOSState";

const MOS = () => {
  const {
    showScanner,
    setShowScanner,
    mosItems,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    currentCode,
    setCurrentCode,
    quantity,
    setQuantity,
    reason,
    setReason,
    storeLocation,
    setStoreLocation,
    isLoading,
    handleScan,
    handleSubmit,
    handleExport,
    handleClearAll,
    incrementQuantity,
    decrementQuantity
  } = useMOSState();

  return (
    <div className="container mx-auto py-6 px-4">
      <MOSHeader />

      <MOSTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentCode={currentCode}
        quantity={quantity}
        reason={reason}
        storeLocation={storeLocation}
        setCurrentCode={setCurrentCode}
        setQuantity={setQuantity}
        setReason={setReason}
        setStoreLocation={setStoreLocation}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        onSubmit={handleSubmit}
        onScanClick={() => setShowScanner(true)}
        mosItems={mosItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExport={handleExport}
        onClearAll={handleClearAll}
        isLoading={isLoading}
      />

      <MOSScannerModal
        showScanner={showScanner}
        onScan={handleScan}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
};

export default MOS;
