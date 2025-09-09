import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import EcoBot from "./components/EcoBot";
import ProtectedRoute from "./components/ProtectedRoute";
import { GreenCoinsProvider } from "./hooks/useGreenCoins";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GreenCoinsProvider>
        <TooltipProvider>
          {/* Eco background gradients and shapes for the whole app */}
          <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-green-100 via-blue-50 to-emerald-100 absolute inset-0" />
            <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-200 via-green-100 to-transparent opacity-60 blur-2xl animate-pulse-slow" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-blue-200 via-cyan-100 to-transparent opacity-50 blur-2xl animate-pulse-slower" />
            <div className="absolute top-[40%] left-[-80px] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-yellow-100 via-green-50 to-transparent opacity-40 blur-2xl animate-pulse-slowest" />
            <div className="absolute bottom-[20%] left-[10%] w-[120px] h-[120px] rounded-full bg-gradient-to-br from-pink-200 via-fuchsia-100 to-transparent opacity-30 blur-2xl animate-pulse-slowest" />
          </div>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                    <EcoBot />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GreenCoinsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
