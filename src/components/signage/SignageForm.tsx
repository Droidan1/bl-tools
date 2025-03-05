
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SignageData } from "@/types/signage";

interface SignageFormProps {
  signageData: SignageData;
  setSignageData: (data: SignageData) => void;
}

export const SignageForm = ({ signageData, setSignageData }: SignageFormProps) => {
  const handleChange = (field: keyof SignageData, value: string) => {
    setSignageData({ ...signageData, [field]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Signage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            placeholder="$19.99"
            value={signageData.price}
            onChange={(e) => handleChange('price', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productDescription">Product Description</Label>
          <Input
            id="productDescription"
            placeholder="Product Description"
            value={signageData.productDescription}
            onChange={(e) => handleChange('productDescription', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="saleType">Sale Type</Label>
          <Select
            value={signageData.saleType}
            onValueChange={(value) => handleChange('saleType', value)}
          >
            <SelectTrigger id="saleType">
              <SelectValue placeholder="Select sale type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sale">Sale</SelectItem>
              <SelectItem value="Clearance">Clearance</SelectItem>
              <SelectItem value="Wow Deal">Wow Deal</SelectItem>
              <SelectItem value="New Arrival">New Arrival</SelectItem>
              <SelectItem value="Blow Out">Blow Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="theirPrice">Their Price</Label>
          <Input
            id="theirPrice"
            placeholder="$29.99"
            value={signageData.theirPrice}
            onChange={(e) => handleChange('theirPrice', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Select
            value={signageData.dimensions}
            onValueChange={(value) => handleChange('dimensions', value)}
          >
            <SelectTrigger id="dimensions">
              <SelectValue placeholder="Select dimensions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8.5 in x 11 in">8.5 in x 11 in (Portrait)</SelectItem>
              <SelectItem value="11 in x 8.5 in">11 in x 8.5 in (Landscape)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
