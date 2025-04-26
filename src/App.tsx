
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { useAuth } from "@/lib/auth";
import Index from "./pages/Index";
import LawFirmHome from "./pages/LawFirmHome";
import Intake from "./pages/Intake";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import BackOffice from "./pages/BackOffice";
import Leads from "./pages/Leads";
import AccountSettings from "./pages/AccountSettings";
import ManageFirms from "./pages/ManageFirms";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Law firm public pages */}
            <Route path="/:firmId" element={<LawFirmHome />} />
            <Route path="/:firmId/intake" element={<Intake />} />
            
            {/* Protected routes */}
            <Route path="/manage" element={<ProtectedRoute><ManageFirms /></ProtectedRoute>} />
            <Route path="/:firmId/back" element={<ProtectedRoute><BackOffice /></ProtectedRoute>}>
              <Route index element={<Leads />} />
              <Route path="leads" element={<Leads />} />
              <Route path="account" element={<AccountSettings />} />
            </Route>
            
            {/* Catch any unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
