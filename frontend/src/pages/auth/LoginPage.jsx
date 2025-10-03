import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await axiosInstance.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      toast.success("Logged in successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
              hover:border-blue-300 text-sm group-hover:shadow-md bg-gray-50 focus:bg-white"
            placeholder="Enter your username"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
              hover:border-blue-300 text-sm group-hover:shadow-md bg-gray-50 focus:bg-white"
            placeholder="Enter your password"
            disabled={isLoading}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center group">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition-all"
            disabled={isLoading}
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-gray-600 cursor-pointer group-hover:text-blue-600 transition-colors">
            Remember me
          </label>
        </div>

        <div className="text-xs">
          <a
            href="#"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl 
            shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800
            hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
            transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md
            relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 
            transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            <span className="flex items-center space-x-2">
              <span>Sign in</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const promotionalContent = [
    {
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
      title: "Connect with Tech Professionals",
      subtitle: "Join millions of developers, engineers, and tech leaders building the future.",
    },
    {
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop",
      title: "Advance Your Tech Career",
      subtitle: "Discover opportunities at top tech companies and startups worldwide.",
    },
    {
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      title: "Learn from Industry Experts",
      subtitle: "Access insights from thought leaders in AI, cloud computing, and emerging tech.",
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      title: "Build Your Professional Network",
      subtitle: "Connect with colleagues, mentors, and potential collaborators in tech.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % promotionalContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentContent = promotionalContent[currentImageIndex];

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10 border border-white/50">
        
        <div className="lg:w-[45%] relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={currentContent.image}
              alt="Tech professionals"
              className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white min-h-[450px]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 font-bold text-lg">in</span>
              </div>
              <span className="text-xl font-bold tracking-tight">LinkedIn</span>
            </div>

            <div className="space-y-5 max-w-md">
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                {currentContent.title}
              </h1>
              <p className="text-base lg:text-lg text-blue-100 leading-relaxed">
                {currentContent.subtitle}
              </p>
              
              <div className="flex space-x-2.5 pt-3">
                {promotionalContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white scale-125 shadow-lg w-8"
                        : "bg-white/50 hover:bg-white/70 hover:scale-110 w-2.5"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-blue-200 text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="font-medium">Over 900 million professionals worldwide</span>
            </div>
          </div>
        </div>

        <div className="lg:w-[55%] flex items-center justify-center p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">in</span>
                </div>
                <span className="text-xl font-bold text-gray-900">LinkedIn</span>
              </div>
            </div>

            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                Sign in to continue to your professional network
              </p>
            </div>

            <LoginForm />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-500 font-semibold">
                  New to LinkedIn?
                </span>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/signup")}
              className="w-full flex justify-center items-center py-2.5 px-4 border-2 border-blue-600 rounded-xl 
                text-sm font-bold text-blue-600 bg-transparent hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 
                transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 
                transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="flex items-center space-x-2">
                <span>Join LinkedIn today</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>

            <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-xs text-blue-800 text-center font-semibold flex items-center justify-center space-x-2">
                <span className="text-lg">🚀</span>
                <span>Join today and get access to exclusive career insights</span>
              </p>
            </div>

            <div className="mt-6 text-center">
              <div className="flex justify-center flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 font-medium">
                <a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:underline">Privacy</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:underline">Terms</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:underline">Help Center</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:underline">About</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;