import { Toaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import Story from "@/pages/Story";
import NotFound from "./pages/NotFound";
import Auth from "./pages/auth/Auth";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import SavedStories from '@/pages/SavedStories';

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <HotToaster position="top-center" />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story" element={<Story />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-stories" element={<SavedStories />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
