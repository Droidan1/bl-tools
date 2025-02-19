import { useState } from 'react';
import { FormField } from '@/components/inventory/FormField';
import { FormHeader } from '@/components/inventory/FormHeader';
import InventoryPage from './InventoryPage';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { PhotoCapture } from '@/components/PhotoCapture';
import { toast } from "sonner";
import { uploadBOLPhoto } from '@/lib/storage';
const tabs = [{
  id: 'add-pallets',
  label: 'Add Pallets'
}, {
  id: 'inventory',
  label: 'Inventory'
}] as const;
type TabId = (typeof tabs)[number]['id'];
const Index = () => {
  const [bolNumber, setBolNumber] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('add-pallets');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bolPhotoUrl, setBolPhotoUrl] = useState<string | null>(null);
  const handlePhotoCapture = async (photoUrl: string) => {
    if (!bolNumber) {
      toast.error("Please enter a BOL number first");
      return;
    }
    setIsUploading(true);
    try {
      const publicUrl = await uploadBOLPhoto(photoUrl, bolNumber);
      setBolPhotoUrl(publicUrl);
      toast.success("BOL photo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload BOL photo");
      console.error(error);
    } finally {
      setIsUploading(false);
      setShowCamera(false);
    }
  };
  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };
  return <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl flex flex-col items-center">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-[#2a8636] p-4 sm:p-6 rounded-xl shadow-sm w-full">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-0 font-['Luckiest_Guy']">
            Inventory Receiver
          </h1>
          <img src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" alt="Header Logo" className="h-24 sm:h-32 md:h-48 w-auto" />
        </div>

        <div className="w-full mb-8 bg-[#2a8636] p-4 rounded-xl px-[16px] py-[10px]">
          <AnimatedTabs tabs={tabs} defaultTab={activeTab} onChange={handleTabChange} />
        </div>

        <div className="w-full max-w-md mx-auto mb-8">
          {activeTab === 'add-pallets' ? <div className="bg-gradient-to-br from-[#2a8636] to-[#3BB54A] p-4 sm:p-6 rounded-xl shadow-sm backdrop-blur-sm border border-white/20">
              <FormHeader storeLocation={storeLocation} setStoreLocation={setStoreLocation} />
              <div className="space-y-4">
                <FormField id="bolNumber" label="BOL #" value={bolNumber} onChange={setBolNumber} placeholder="Enter BOL number" required />
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="secondary" onClick={() => setShowCamera(true)} disabled={isUploading || !bolNumber} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Take Photo of BOL'}
                  </Button>
                  {bolPhotoUrl && <div className="relative mt-2">
                      <img src={bolPhotoUrl} alt="BOL" className="w-full h-40 object-cover rounded-lg" />
                    </div>}
                </div>
              </div>
            </div> : <div className="bg-gradient-to-br from-[#2a8636] to-[#3BB54A] p-4 sm:p-6 rounded-xl shadow-sm backdrop-blur-sm border border-white/20 px-[12px] py-[12px]">
              <div className="group relative w-full">
                <label htmlFor="search-input" className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-white/70 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-white has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-white">
                  <span className="inline-flex bg-gradient-to-br from-[#2a8636] to-[#3BB54A] px-2">Search inventory</span>
                </label>
                <Input id="search-input" type="text" placeholder="" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white/95 rounded-lg border-0 shadow-sm" />
              </div>
            </div>}
        </div>
        
        <div className="w-full">
          <InventoryPage bolNumber={bolNumber} showRecentEntries={activeTab === 'inventory'} searchQuery={searchQuery} setActiveTab={handleTabChange} bolPhotoUrl={bolPhotoUrl} storeLocation={storeLocation} />
        </div>
      </div>

      {showCamera && <PhotoCapture onCapture={handlePhotoCapture} onClose={() => setShowCamera(false)} />}
    </div>;
};
export default Index;