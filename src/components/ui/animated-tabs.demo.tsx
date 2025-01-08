"use client";

import { AnimatedTabs } from "@/components/ui/animated-tabs";

const tabs = [
  { id: "world", label: "World" },
  { id: "ny", label: "N.Y." },
  { id: "business", label: "Business" },
  { id: "arts", label: "Arts" },
  { id: "science", label: "Science" },
];

function TabsDemo() {
  return (
    <div className="flex min-h-[100px] w-full items-center justify-center p-4">
      <AnimatedTabs 
        tabs={tabs}
        onChange={(tabId) => console.log("Tab changed:", tabId)} 
      />
    </div>
  );
}

export default { TabsDemo };