import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DiscoveryDemoStandalone from "@/pages/discovery-demo";
import FigmaDesign from "@/pages/figma-design";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href}>
      <div className={cn(
        "px-4 py-2 text-sm font-medium transition-colors rounded-md cursor-pointer",
        isActive 
          ? "bg-slate-800 text-white" 
          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
      )}>
        {children}
      </div>
    </Link>
  );
}

function Router() {
  return (
    <div className="flex flex-col h-screen bg-slate-950">
      <nav className="flex items-center gap-1 p-2 border-b border-slate-800 bg-slate-900/50 z-50 relative">
        <div className="flex items-center gap-2 px-4 mr-4 border-r border-slate-800/50">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            AutonomOS
          </span>
        </div>
        <NavLink href="/">Visualization</NavLink>
        <NavLink href="/figma">Figma Design</NavLink>
      </nav>
      
      <div className="flex-1 overflow-hidden">
        <Switch>
          <Route path="/" component={DiscoveryDemoStandalone} />
          <Route path="/figma" component={FigmaDesign} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
