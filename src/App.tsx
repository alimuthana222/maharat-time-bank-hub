
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";

const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const TimeBank = lazy(() => import("./pages/TimeBank"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Messages = lazy(() => import("./pages/Messages"));
const Community = lazy(() => import("./pages/Community"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/profile" 
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            <Route 
              path="/timebank" 
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                  <TimeBank />
                </Suspense>
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                  <Marketplace />
                </Suspense>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            <Route 
              path="/community" 
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                  <Community />
                </Suspense>
              } 
            />
            <Route 
              path="/help" 
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                  <HelpCenter />
                </Suspense>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                  <ProtectedRoute admin>
                    <AdminDashboard />
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
