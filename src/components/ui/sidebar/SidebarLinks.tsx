
import { Package, Calculator, FileText, Link, Layout, TagIcon } from "lucide-react";
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
    label: "Journal",
    href: "/winsheet",
    icon: <FileText className="text-white h-5 w-5 flex-shrink-0" />
  },
  {
    label: "Projects & Zones",
    href: "/projects",
    icon: <Layout className="text-white h-5 w-5 flex-shrink-0" />
  },
  {
    label: "Signage",
    href: "/signage",
    icon: <TagIcon className="text-white h-5 w-5 flex-shrink-0" />
  },
  {
    label: "Links",
    href: "/links",
    icon: <Link className="text-white h-5 w-5 flex-shrink-0" />
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
