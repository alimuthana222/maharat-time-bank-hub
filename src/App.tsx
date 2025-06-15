
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { RoleBasedRoute } from "@/components/auth/RoleBasedRoute";

// Public pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NewAuth from "@/pages/NewAuth";
import NewRegister from "@/pages/NewRegister";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import HelpCenter from "@/pages/HelpCenter";

// Protected pages
import Dashboard from "@/pages/Dashboard";
import StudentProfile from "@/pages/StudentProfile";
import Marketplace from "@/pages/Marketplace";
import TimeBank from "@/pages/TimeBank";
import Community from "@/pages/Community";
import RealCommunity from "@/pages/RealCommunity";
import Events from "@/pages/Events";
import RealEvents from "@/pages/RealEvents";
import Messages from "@/pages/Messages";
import Search from "@/pages/Search";
import Bookings from "@/pages/Bookings";
import UserOnboarding from "@/pages/UserOnboarding";
import Wallet from "@/pages/Wallet";

// Admin pages
import AdminDashboard from "@/pages/AdminDashboard";
import RealAdminDashboard from "@/pages/RealAdminDashboard";
import ModeratorDashboard from "@/pages/ModeratorDashboard";
import OwnerDashboard from "@/pages/OwnerDashboard";

// Advertisement pages
import AdvertisementMarket from "@/pages/AdvertisementMarket";
import CreateAd from "@/pages/CreateAd";
import AdDetails from "@/pages/AdDetails";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/new-auth" element={<NewAuth />} />
            <Route path="/new-register" element={<NewRegister />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/ads" element={<AdvertisementMarket />} />
            <Route path="/ads/:id" element={<AdDetails />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } />
            <Route path="/timebank" element={
              <ProtectedRoute>
                <TimeBank />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <RealCommunity />
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <RealEvents />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
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
            <Route path="/wallet" element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <UserOnboarding />
              </ProtectedRoute>
            } />
            <Route path="/create-ad" element={
              <ProtectedRoute>
                <CreateAd />
              </ProtectedRoute>
            } />

            {/* Role-based routes */}
            <Route path="/admin" element={
              <RoleBasedRoute allowedRoles={['admin', 'owner']}>
                <RealAdminDashboard />
              </RoleBasedRoute>
            } />
            <Route path="/moderator" element={
              <RoleBasedRoute allowedRoles={['moderator', 'admin', 'owner']}>
                <ModeratorDashboard />
              </RoleBasedRoute>
            } />
            <Route path="/owner" element={
              <RoleBasedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </RoleBasedRoute>
            } />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
