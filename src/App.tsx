
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TimeBank from "./pages/TimeBank";
import Marketplace from "./pages/Marketplace";
import Messages from "./pages/Messages";
import StudentProfile from "./pages/StudentProfile";
import Search from "./pages/Search";
import Bookings from "./pages/Bookings";
import Community from "./pages/Community";
import Events from "./pages/Events";
import RealEvents from "./pages/RealEvents";
import RealCommunity from "./pages/RealCommunity";
import RealAdminDashboard from "./pages/RealAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/timebank" element={
                <ProtectedRoute>
                  <TimeBank />
                </ProtectedRoute>
              } />
              
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } />
              
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />

              <Route path="/bookings" element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } />
              
              {/* Real Community and Events */}
              <Route path="/community" element={<RealCommunity />} />
              <Route path="/events" element={<RealEvents />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <RealAdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/owner" element={
                <ProtectedRoute ownerOnly>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/moderator" element={
                <ProtectedRoute moderatorOnly>
                  <ModeratorDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
