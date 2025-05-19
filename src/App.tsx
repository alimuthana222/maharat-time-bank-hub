
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import TimeBank from "./pages/TimeBank";
import Dashboard from "./pages/Dashboard";
import StudentProfile from "./pages/StudentProfile";
import Events from "./pages/Events";
import Messages from "./pages/Messages";
import Community from "./pages/Community";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import NotFound from "./pages/NotFound";
import HelpCenter from "./pages/HelpCenter";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { initTheme } from "./lib/theme-utils";
import "./App.css";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  // Initialize theme
  useEffect(() => {
    initTheme();
  }, []);
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/timebank" element={
            <ProtectedRoute>
              <TimeBank />
            </ProtectedRoute>
          } />
          <Route path="/time-bank" element={
            <ProtectedRoute>
              <TimeBank />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile/:id" element={<StudentProfile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
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
          <Route path="/help" element={<HelpCenter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <SonnerToaster position="bottom-left" dir="rtl" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
