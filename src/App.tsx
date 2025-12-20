import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
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
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/leads" element={<LeadsManagement />} />
            <Route path="/admin/operators" element={<OperatorsManagement />} />
            <Route path="/admin/fleet" element={<FleetManagement />} />
            <Route path="/admin/empty-legs" element={<EmptyLegs />} />
            <Route path="/admin/joyrides" element={<Joyrides />} />
            <Route path="/admin/deals" element={<Deals />} />
            <Route path="/admin/settings" element={<Settings />} />
            
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