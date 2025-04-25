
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LawFirmHome from "./pages/LawFirmHome";
import Intake from "./pages/Intake";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import BackOffice from "./pages/BackOffice";
import Leads from "./pages/Leads";
import AccountSettings from "./pages/AccountSettings";
import ManageFirms from "./pages/ManageFirms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Marketing site */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manage" element={<ManageFirms />} />
          
          {/* Law firm public pages */}
          <Route path="/:firmId" element={<LawFirmHome />} />
          <Route path="/:firmId/intake" element={<Intake />} />
          
          {/* Law firm back office */}
          <Route path="/:firmId/back" element={<BackOffice />}>
            <Route index element={<Leads />} />
            <Route path="leads" element={<Leads />} />
            <Route path="account" element={<AccountSettings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
