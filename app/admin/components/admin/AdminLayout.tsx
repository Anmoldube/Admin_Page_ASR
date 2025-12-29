import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Plane,
  LayoutDashboard,
  Users,
  FileText,
  Tag,
  Sparkles,
  Settings,
  ChevronDown,
  Globe,
  Clock,
  LogOut,
  Menu,
  X,
  Heart,
  Car,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin, Vertical } from "@admin/contexts/AdminContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

const verticalConfig: Record<Vertical, { name: string; icon: typeof Plane; color: string }> = {
  charter: { name: "Charter", icon: Plane, color: "text-accent" },
  "air-ambulance": { name: "Air Ambulance", icon: Heart, color: "text-destructive" },
  "air-taxi": { name: "Air Taxifree", icon: Car, color: "text-primary" },
};

const charterNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: FileText },
  { name: "Operators", href: "/admin/operators", icon: Users },
  { name: "Fleet", href: "/admin/fleet", icon: Plane },
  { name: "Empty Legs", href: "/admin/empty-legs", icon: Tag },
  { name: "Joyrides", href: "/admin/joyrides", icon: Sparkles },
  { name: "Deals", href: "/admin/deals", icon: Tag },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const airAmbulanceNavigation = [
  { name: "Dashboard", href: "/admin/air-ambulance/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/air-ambulance/leads", icon: FileText },
  { name: "Fleet", href: "/admin/air-ambulance/fleet", icon: Plane },
  { name: "Operators", href: "/admin/air-ambulance/operators", icon: Users },
  { name: "Live Map", href: "/admin/air-ambulance/map", icon: Heart },
  { name: "Pricing", href: "/admin/air-ambulance/pricing", icon: Tag },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const airTaxiNavigation = [
  { name: "Fleet", href: "/admin/joyrides", icon: Plane },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const getNavigation = (vertical: Vertical) => {
  switch (vertical) {
    case "air-ambulance":
      return airAmbulanceNavigation;
    case "air-taxi":
      return airTaxiNavigation;
    default:
      return charterNavigation;
  }
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentVertical, setCurrentVertical, isAuthenticated, setIsAuthenticated } = useAdmin();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auth guarding is handled by the top-level <Protected> wrapper in App.tsx.
  // Avoid redirecting here to prevent loops back to /login after a valid Protected check.
  // If you need to show user info, read from localStorage or context instead.

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const VerticalIcon = verticalConfig[currentVertical].icon;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">ASR AVIATION</h1>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Vertical Switcher */}
          <div className="p-4 border-b border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal bg-secondary/50"
                >
                  <div className="flex items-center gap-2">
                    <VerticalIcon className={cn("w-4 h-4", verticalConfig[currentVertical].color)} />
                    <span className="font-medium">{verticalConfig[currentVertical].name}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-popover">
                {(Object.keys(verticalConfig) as Vertical[]).map((vertical) => {
                  const config = verticalConfig[vertical];
                  return (
                    <DropdownMenuItem
                      key={vertical}
                      onClick={() => setCurrentVertical(vertical)}
                      className={cn(
                        "cursor-pointer",
                        currentVertical === vertical && "bg-accent/10"
                      )}
                    >
                      <config.icon className={cn("w-4 h-4 mr-2", config.color)} />
                      {config.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {getNavigation(currentVertical).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-foreground">
                  {verticalConfig[currentVertical].name} Admin
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timezone & Clock */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-xs text-muted-foreground">IST</span>
              </div>

              {/* Language */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <Globe className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem disabled>Hindi (Coming Soon)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                      <span className="text-xs font-bold text-accent-foreground">AS</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium">Admin</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};