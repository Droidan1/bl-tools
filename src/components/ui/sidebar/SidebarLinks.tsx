import { Package, Calculator, FileText } from "lucide-react";
import { SidebarLink } from "../sidebar";

export const links = [
  {
    label: "Inventory Receiver",
    href: "/",
    icon: <Package className="text-white h-5 w-5 flex-shrink-0" />
  },
  {
    label: "Labor Calculator",
    href: "/labor",
    icon: <Calculator className="text-white h-5 w-5 flex-shrink-0" />
  },
  {
    label: "Win Sheet",
    href: "/winsheet",
    icon: <FileText className="text-white h-5 w-5 flex-shrink-0" />
  }
];

export const NavigationLinks = () => {
  return (
    <div className="mt-8 flex flex-col gap-2">
      {links.map((link, idx) => (
        <SidebarLink key={idx} link={link} />
      ))}
    </div>
  );
};