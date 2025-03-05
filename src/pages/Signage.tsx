
import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SignageForm } from '@/components/signage/SignageForm';
import { SignagePreview } from '@/components/signage/SignagePreview';
import { SignageToolbar } from '@/components/signage/SignageToolbar';
import { SignageData } from '@/types/signage';

const Signage = () => {
  const [signageData, setSignageData] = useState<SignageData>({
    price: '',
    productDescription: '',
    saleType: 'Sale',
    theirPrice: '',
    dimensions: '8.5 in x 11 in',
  });

  return (
    <div className="container py-6">
      <PageHeader title="Signage" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SignageForm signageData={signageData} setSignageData={setSignageData} />
        <div className="flex flex-col gap-4">
          <SignageToolbar signageData={signageData} />
          <SignagePreview signageData={signageData} />
        </div>
      </div>
    </div>
  );
};

export default Signage;
