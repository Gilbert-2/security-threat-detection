
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VideoFeed from "./pages/VideoFeed";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Incidents from "./pages/Incidents";
import Landing from "./pages/Landing";
import { Sidebar } from "./components/Sidebar";
import ResponseRules from "./pages/ResponseRules";
import UserActivity from "./pages/UserActivity";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/landing" element={<Landing />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Sidebar />}>
                <Route path="/" element={<Index />} />
                <Route path="/video-feed" element={<VideoFeed />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/history" element={<History />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/response-rules" element={<ResponseRules />} />
                <Route path="/user-activity" element={<UserActivity />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
