import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Calculator, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = ({ open, setOpen, children }: { open: boolean; setOpen: (open: boolean) => void; children: React.ReactNode }) => {
  return (
    <aside
      className={cn(
        "h-full bg-gray-100 dark:bg-neutral-800 w-20 md:w-[300px] relative transition-all duration-300",
        !open && "md:w-20"
      )}
    >
      {children}
    </aside>
  );
};

const SidebarBody = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={cn("h-full flex flex-col p-3", className)}>
      {children}
    </div>
  );
};

const SidebarLink = ({ link }: { link: { label: string; href: string; icon: React.ReactNode } }) => {
  return (
    <Link
      to={link.href}
      className="flex items-center gap-4 px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
    >
      {link.icon}
      <span className="text-sm font-medium">{link.label}</span>
    </Link>
  );
};

export function SidebarNav() {
  const [open, setOpen] = useState(true);
  
  const links = [
    {
      label: "Inventory Receiver",
      href: "/",
      icon: <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Labor Calculator",
      href: "/labor",
      icon: <Calculator className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Win Sheet",
      href: "/winsheet",
      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-[#3BB54A] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
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
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-[#3BB54A] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export default SidebarNav;