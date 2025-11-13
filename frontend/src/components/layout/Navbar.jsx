import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Home, 
  LogOut, 
  User, 
  Users, 
  MessageSquare, 
  Briefcase, 
  Search, 
  Plus,
  FileText,
  List
} from "lucide-react";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // ✅ FIX: Return res.data instead of the full response
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      console.log("Notifications response:", res.data); // Debug log
      // Handle different response formats
      if (Array.isArray(res.data)) return res.data;
      if (res.data?.notifications) return res.data.notifications;
      if (res.data?.data) return res.data.data;
      return [];
    },
    enabled: !!authUser,
  });

  // ✅ FIX: Same fix for connectionRequests
  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connections/requests");
      console.log("Connection requests response:", res.data); // Debug log
      // Handle different response formats
      if (Array.isArray(res.data)) return res.data;
      if (res.data?.requests) return res.data.requests;
      if (res.data?.data) return res.data.data;
      return [];
    },
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications?.filter(n => !n.read).length || 0;
  const unreadConnectionRequestsCount = connectionRequests?.length || 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              LinkedIn
            </Link>
          </div>

          {/* Center - Search (optional) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center space-x-4">
            {authUser ? (
              <>
                <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
                  <Home size={20} />
                  <span className="text-xs mt-1">Home</span>
                </Link>

                <Link to="/network" className="flex flex-col items-center text-gray-600 hover:text-blue-600 relative">
                  <Users size={20} />
                  <span className="text-xs mt-1">Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>

                <Link to="/post" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
                  <Plus size={20} />
                  <span className="text-xs mt-1">Post</span>
                </Link>

                <Link to="/notifications" className="flex flex-col items-center text-gray-600 hover:text-blue-600 relative">
                  <Bell size={20} />
                  <span className="text-xs mt-1">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>

                <Link to={`/profile/${authUser?.username}`} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
                  <User size={20} />
                  <span className="text-xs mt-1">Me</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex flex-col items-center text-gray-600 hover:text-red-600"
                >
                  <LogOut size={20} />
                  <span className="text-xs mt-1">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
