import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "@admin/contexts/AdminContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import LeadsManagement from "./pages/admin/LeadsManagement";
import OperatorsManagement from "./pages/admin/OperatorsManagement";
import FleetManagement from "./pages/admin/FleetManagement";
import EmptyLegs from "./pages/admin/EmptyLegs";
import Joyrides from "./pages/admin/Joyrides";
import Deals from "./pages/admin/Deals";
import Settings from "./pages/admin/Settings";

// Air Ambulance Pages
import AirAmbulanceDashboard from "./pages/admin/air-ambulance/Dashboard";
import AirAmbulanceLeads from "./pages/admin/air-ambulance/LeadManagement";
import AirAmbulanceFleet from "./pages/admin/air-ambulance/FleetManagement";
import AirAmbulanceOperators from "./pages/admin/air-ambulance/OperatorsManagement";
import AirAmbulanceMap from "./pages/admin/air-ambulance/MapView";
import AirAmbulancePricing from "./pages/admin/air-ambulance/PricingInvoice";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === 'undefined') return null;

  const getCookie = (name: string) => {
    try {
      const parts = document.cookie.split(';').map(c => c.trim());
      for (const p of parts) {
        if (p.startsWith(name + '=')) return decodeURIComponent(p.slice(name.length + 1));
      }
    } catch {}
    return null;
  };

  try {
    // Prefer explicit admin SPA keys first
    let token = localStorage.getItem('token');
    let userStr = localStorage.getItem('user');

    // Fallback to shared cookies if needed (when coming from Next /login etc.)
    if (!token) token = getCookie('asr_access');
    if (!userStr) userStr = getCookie('asr_user');

    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user && user.role === 'admin') {
      return <>{children}</>;
    }

    // Not authenticated or not admin
    window.location.href = '/login';
    return null;
  } catch (e) {
    window.location.href = '/login';
    return null;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/admin/leads" element={<Protected><LeadsManagement /></Protected>} />
            <Route path="/admin/operators" element={<Protected><OperatorsManagement /></Protected>} />
            <Route path="/admin/fleet" element={<Protected><FleetManagement /></Protected>} />
            <Route path="/admin/empty-legs" element={<Protected><EmptyLegs /></Protected>} />
            <Route path="/admin/joyrides" element={<Protected><Joyrides /></Protected>} />
            <Route path="/admin/deals" element={<Protected><Deals /></Protected>} />
            <Route path="/admin/settings" element={<Protected><Settings /></Protected>} />

            {/* Air Ambulance Routes */}
            <Route path="/admin/air-ambulance" element={<Navigate to="/admin/air-ambulance/dashboard" replace />} />
            <Route path="/admin/air-ambulance/dashboard" element={<Protected><AirAmbulanceDashboard /></Protected>} />
            <Route path="/admin/air-ambulance/leads" element={<Protected><AirAmbulanceLeads /></Protected>} />
            <Route path="/admin/air-ambulance/operators" element={<Protected><AirAmbulanceOperators /></Protected>} />
            <Route path="/admin/air-ambulance/fleet" element={<Protected><AirAmbulanceFleet /></Protected>} />
            <Route path="/admin/air-ambulance/map" element={<Protected><AirAmbulanceMap /></Protected>} />
            <Route path="/admin/air-ambulance/pricing" element={<Protected><AirAmbulancePricing /></Protected>} />
            
            {/* Legacy routes redirect */}
            <Route path="/admin/leg-deals" element={<Navigate to="/admin/empty-legs" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;