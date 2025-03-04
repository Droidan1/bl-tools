import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import PhotoPage from "./pages/photos/[id]";
import Labor from "./pages/Labor";
import WinSheet from "./pages/WinSheet";
import Links from "./pages/Links";
import ProjectsAndZonesPage from "./pages/ProjectsAndZones";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            element={
              <div className="flex h-screen">
                <SidebarNav />
                <div className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/inventory" element={<Index />} />
                    <Route path="/photos/:id" element={<PhotoPage />} />
                    <Route path="/labor" element={<Labor />} />
                    <Route path="/winsheet" element={<WinSheet />} />
                    <Route path="/projects-zones" element={<ProjectsAndZonesPage />} />
                    <Route path="/links" element={<Links />} />
                  </Routes>
                </div>
              </div>
            }
          >
            <Route path="/inventory" element={<Index />} />
            <Route path="/photos/:id" element={<PhotoPage />} />
            <Route path="/labor" element={<Labor />} />
            <Route path="/winsheet" element={<WinSheet />} />
            <Route path="/projects-zones" element={<ProjectsAndZonesPage />} />
            <Route path="/links" element={<Links />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
