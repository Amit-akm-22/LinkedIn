import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import MessagingPage from "./pages/MessagingPage";

// ✅ Job-related page imports
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import PostJobPage from "./pages/PostJobPage";
import MyPostedJobsPage from "./pages/MyPostedJobsPage";
import ApplicationsPage from "./pages/ApplicationPage";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  
  // ✅ Check if user is authenticated with better error handling
  const { data: authUser, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        // Only log actual errors, not 401 (which is expected when not logged in)
        if (err.response?.status !== 401) {
          console.error("Auth check error:", err);
        }
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // ✅ Debug logging (remove in production)
  useEffect(() => {
    console.log("🔍 Auth Status:", {
      isLoading,
      authUser: authUser ? "Logged in" : "Not logged in",
      currentPath: location.pathname,
    });
  }, [authUser, isLoading, location.pathname]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
        />

        {/* Protected Routes - Only accessible when logged in */}
        <Route
          path="/"
          element={authUser ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="post/:postId" element={<PostPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="messaging" element={<MessagingPage />} />
          
          {/* ✅ Job Routes */}
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:id" element={<JobDetailsPage />} />
          <Route path="jobs/post" element={<PostJobPage />} />
          <Route path="my-applications" element={<ApplicationsPage />} />
          <Route path="my-posted-jobs" element={<MyPostedJobsPage />} />
        </Route>

        {/* Catch all - redirect to home or login based on auth status */}
        <Route
          path="*"
          element={<Navigate to={authUser ? "/" : "/login"} replace />}
        />
      </Routes>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
