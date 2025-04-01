
"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface AnimatedTabsProps<T extends string> {
  tabs: readonly { id: T; label: string; }[];
  defaultTab?: T;
  onChange?: (tabId: T) => void;
}

export function AnimatedTabs<T extends string>({ 
  tabs, 
  defaultTab,
  onChange 
}: AnimatedTabsProps<T>) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab || tabs[0].id);

  const handleTabChange = (tabId: T) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="flex space-x-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`
            relative rounded-[--radius] px-3 py-1.5 text-sm font-medium
            text-white outline-ring transition
            focus-visible:outline-2
            ${activeTab === tab.id ? "bg-white/20" : "hover:bg-white/10"}
          `}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
