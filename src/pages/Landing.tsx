import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Grid, FileText, Calculator, Link as LinkIcon } from "lucide-react";
import { Typewriter } from "@/components/ui/typewriter-text";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <img 
          src="/lovable-uploads/7ed70ca5-aac2-4afe-8bc9-92ca717e7ba7.png"
          alt="Dollar Sign Mascot with Shopping Cart"
          className="w-48 h-48 mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-[#2a8636] mb-4 font-['Luckiest_Guy']">
          <Typewriter
            text="Welcome to Bargain Lane Tools"
            speed={100}
            cursor="|"
            className="inline-block"
          />
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