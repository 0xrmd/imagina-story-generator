import { Toaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Suspense, lazy } from 'react';
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";

// Lazy load components
const Home = lazy(() => import('@/pages/Home'));
const Story = lazy(() => import('@/pages/Story'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Auth = lazy(() => import('./pages/auth/Auth'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const SavedStories = lazy(() => import('@/pages/SavedStories'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Toaster />
      <HotToaster position="top-center" />
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story" element={<Story />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-stories" element={<SavedStories />} />
            <Route path="/auth" element={<AuthRedirect><Auth /></AuthRedirect>} />
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
        </Suspense>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
