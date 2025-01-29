import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Grid, FileText, Calculator, Link as LinkIcon } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <img 
          src="/lovable-uploads/d46315bd-45b5-464c-aba1-45fd5bc4eb34.png" 
          alt="Bargain Lane Mascot" 
          className="w-32 h-32 mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-[#2a8636] mb-4 font-['Luckiest_Guy']">
          Welcome to Bargain Lane Tools
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Link to="/inventory" className="no-underline">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all"
          >
            <Grid className="h-8 w-8" />
            Inventory Receiver
          </Button>
        </Link>

        <Link to="/labor" className="no-underline">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all"
          >
            <Calculator className="h-8 w-8" />
            Labor Calculator
          </Button>
        </Link>

        <Link to="/winsheet" className="no-underline">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all"
          >
            <FileText className="h-8 w-8" />
            Win Sheet
          </Button>
        </Link>

        <Link to="/links" className="no-underline">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all"
          >
            <LinkIcon className="h-8 w-8" />
            Links
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;