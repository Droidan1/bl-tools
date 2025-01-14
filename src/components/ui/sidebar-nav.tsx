import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Calculator, FileText } from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";

export function SidebarNav() {
  const [open, setOpen] = useState(false);
  
  const links = [
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

  return (
    <div className="h-screen flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="p-6">
          {/* Content will be rendered here */}
        </div>
      </main>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre"
      >
        Inventory System
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export default SidebarNav;
