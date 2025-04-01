
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { Menu, X } from "lucide-react";

const SidebarContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  animate: boolean;
} | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        animate,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-[#2a8636] dark:bg-[#3BB54A] w-[300px] flex-shrink-0",
        className
      )}
      style={{
        width: animate ? (open ? "300px" : "60px") : "300px",
        transition: "width 0.2s ease-in-out",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();

  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-[#2a8636] dark:bg-[#3BB54A] w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu className="text-white cursor-pointer" onClick={() => setOpen(!open)} />
        </div>
        
        {open && (
          <div
            className={cn(
              "fixed h-full w-full inset-0 bg-[#2a8636] dark:bg-[#3BB54A] p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-white cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <X />
            </div>
            {children}
          </div>
        )}
      </div>
    </>
  );
};

interface SidebarLinkProps {
  link: { 
    href: string; 
    label: string; 
    icon: React.ReactNode;
  };
  className?: string;
}

export const SidebarLink = ({ link, className }: SidebarLinkProps) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      to={link.href}
      className={cn("flex items-center justify-start gap-2 group/sidebar py-2", className)}
    >
      {link.icon}
      <span
        style={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
        className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </span>
    </Link>
  );
};
