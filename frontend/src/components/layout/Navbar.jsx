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

  // ✅ FIX: Return res.data and handle different response formats
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
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

  // ✅ Calculate unread counts with safety checks
  const unreadNotificationsCount = Array.isArray(notifications) 
    ? notifications.filter(n => !n.read).length 
    : 0;
  const unreadConnectionRequestsCount = Array.isArray(connectionRequests) 
    ? connectionRequests.length 
    : 0;

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b-2 border-white/50 sticky top-0 z-50 relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Outer glow effect */}
                <div className="absolute inset-0 bg-blue-500 rounded-md blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                {/* Main logo container - LinkedIn Blue #0A66C2 */}
                <div className="relative w-9 h-9 bg-[#0A66C2] rounded-md flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  {/* LinkedIn 'in' logo - exact proportions */}
                  <span className="text-white font-bold text-[22px] leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                    in
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  LinkedIn
                </span>
              </div>
            </Link>
            
            {authUser && (
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md w-56"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {authUser ? (
              <>
                <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-blue-600 group transition-all duration-300 px-3 py-2 rounded-xl hover:bg-blue-50/50">
                  <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs mt-1 hidden md:block font-medium">Home</span>
                </Link>
                
                <Link to="/network" className="flex flex-col items-center text-gray-600 hover:text-blue-600 group transition-all duration-300 relative px-3 py-2 rounded-xl hover:bg-blue-50/50">
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs mt-1 hidden md:block font-medium">Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full size-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                
                <Link to="/jobs" className="flex flex-col items-center text-gray-600 hover:text-blue-600 group transition-all duration-300 px-3 py-2 rounded-xl hover:bg-blue-50/50">
                  <Briefcase className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs mt-1 hidden md:block font-medium">Jobs</span>
                </Link>
                
                <Link to="/messaging" className="flex flex-col items-center text-gray-600 hover:text-blue-600 group transition-all duration-300 px-3 py-2 rounded-xl hover:bg-blue-50/50">
                  <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs mt-1 hidden md:block font-medium">Messaging</span>
                </Link>
                
                <Link to="/notifications" className="flex flex-col items-center text-gray-600 hover:text-blue-600 group transition-all duration-300 relative px-3 py-2 rounded-xl hover:bg-blue-50/50">
                  <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-xs mt-1 hidden md:block font-medium">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full size-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>
                
                <Link to={`/profile/${authUser.username}`} className="flex flex-col items-center text-gray-600 hover:text-blue-600 group transition-all duration-300 px-3 py-2 rounded-xl hover:bg-blue-50/50">
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs mt-1 hidden md:block font-medium">Me</span>
                </Link>
                
                <div className="h-8 border-l-2 border-gray-200"></div>
                
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-1.5 text-sm text-gray-600 hover:text-red-600 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-red-50/50 group font-medium"
                >
                  <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 px-4 py-2 rounded-xl hover:bg-blue-50/50 relative group overflow-hidden"
                >
                  <span className="relative z-10">LogIn</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/50 to-blue-50/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                </Link>
                <Link 
                  to="/signup" 
                  className="px-5 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 relative group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-1">
                    <span>Join now</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
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
