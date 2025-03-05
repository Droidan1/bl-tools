
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Grid, FileText, Calculator, Link as LinkIcon, Loader, Layout, TagIcon } from "lucide-react";
import { Typewriter } from "@/components/ui/typewriter-text";
import { PopoverForm, PopoverFormSuccess } from "@/components/ui/popover-form";
import { useState } from "react";

const Landing = () => {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!feedback) return;
    setFormState("loading");
    setTimeout(() => {
      setFormState("success");
    }, 1500);
    setTimeout(() => {
      setOpen(false);
      setFormState("idle");
      setFeedback("");
    }, 3300);
  };

  return <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-green-200 hover:bg-green-100">
      <div className="absolute top-4 right-4">
        <PopoverForm title="Feedback" open={open} setOpen={setOpen} width="364px" height="192px" showCloseButton={formState !== "success"} showSuccess={formState === "success"} openChild={<form onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }} className="">
              <div className="relative">
                <textarea autoFocus placeholder="Share your feedback..." value={feedback} onChange={e => setFeedback(e.target.value)} className="h-32 w-full resize-none rounded-t-lg p-3 text-sm outline-none" required />
              </div>
              <div className="relative flex h-12 items-center px-[10px]">
                <button type="submit" className="ml-auto flex h-6 items-center justify-center overflow-hidden rounded-md bg-[#2a8636] px-3 text-xs font-semibold text-white">
                  {formState === "loading" ? <Loader className="animate-spin h-3 w-3" /> : "Submit"}
                </button>
              </div>
            </form>} successChild={<PopoverFormSuccess title="Feedback Received" description="Thank you for helping us improve!" />} />
      </div>

      <div className="text-center mb-12">
        <img src="/lovable-uploads/7ed70ca5-aac2-4afe-8bc9-92ca717e7ba7.png" alt="Dollar Sign Mascot with Shopping Cart" className="w-48 h-48 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-[#2a8636] mb-4 font-['Luckiest_Guy']">
          <Typewriter text="Welcome to Bargain Lane Tools" speed={100} cursor="|" className="inline-block" />
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        <Link to="/inventory" className="no-underline">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all">
            <Grid className="h-8 w-8" />
            Inventory Receiver
          </Button>
        </Link>

        <Link to="/labor" className="no-underline">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all">
            <Calculator className="h-8 w-8" />
            Labor Calculator
          </Button>
        </Link>

        <Link to="/winsheet" className="no-underline">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all">
            <FileText className="h-8 w-8" />
            Journal
          </Button>
        </Link>

        <Link to="/projects" className="no-underline">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all">
            <Layout className="h-8 w-8" />
            Projects & Zones
          </Button>
        </Link>

        <Link to="/signage" className="no-underline">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all">
            <TagIcon className="h-8 w-8" />
            Signage
          </Button>
        </Link>

        <Link to="/links" className="no-underline">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-[#2a8636] hover:text-white transition-all">
            <LinkIcon className="h-8 w-8" />
            Links
          </Button>
        </Link>
      </div>
    </div>;
};

export default Landing;
