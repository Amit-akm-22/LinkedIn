import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import MessagingPage from "./pages/MessagingPage";
import JobsPage from "./pages/JobsPage";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import { Toaster } from "react-hot-toast";

function App() {
  // ✅ Check if user is authenticated
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        // If error (401), user is not authenticated
        return null;
      }
    },
    retry: false,
  });

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <Route path="jobs" element={<JobsPage />} />
        </Route>

        {/* Catch all - redirect to home or login */}
        <Route
          path="*"
          element={<Navigate to={authUser ? "/" : "/login"} replace />}
        />
      </Routes>

      <Toaster position="top-center" />
    </>
  );
}

export default App;
