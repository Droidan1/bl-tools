import React, { useState } from "react";
import { Sidebar, SidebarBody } from "./sidebar";
import { Logo, LogoIcon } from "./sidebar/Logo";
import { NavigationLinks } from "./sidebar/SidebarLinks";

export function SidebarNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <NavigationLinks />
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

export default SidebarNav;
