import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
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
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-4 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main container - Smaller and more compact */}
<div className="w-full max-w-5xl max-h-[calc(100vh-5rem)] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10 border border-white/50">        
        {/* Left side - Promotional Content */}
        <div className="lg:w-[42%] relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden hidden lg:block">
          <div className="absolute inset-0">
            <img
              src={currentContent.image}
              alt="Tech professionals"
              className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 font-bold text-base">in</span>
              </div>
              <span className="text-lg font-bold tracking-tight">LinkedIn</span>
            </div>

            {/* Text content */}
            <div className="space-y-3 max-w-sm">
              <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
                {currentContent.title}
              </h1>
              <p className="text-sm text-blue-100 leading-relaxed">
                {currentContent.subtitle}
              </p>
              
              {/* Indicators */}
              <div className="flex space-x-2 pt-2">
                {promotionalContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white scale-125 shadow-lg w-6"
                        : "bg-white/50 hover:bg-white/70 hover:scale-110 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom text */}
            <div className="flex items-center space-x-1.5 text-blue-200 text-xs">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="font-medium">Over 900 million professionals</span>
            </div>
          </div>
        </div>

        {/* Right side - SignUp Form */}
        <div className="lg:w-[58%] flex items-center justify-center p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-lg">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-4">
              <div className="inline-flex items-center space-x-2.5 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base">in</span>
                </div>
                <span className="text-lg font-bold text-gray-900">LinkedIn</span>
              </div>
            </div>

            {/* Welcome section - Smaller */}
            <div className="text-center lg:text-left mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Make the most of your professional life
              </h2>
              <p className="text-xs text-gray-600 font-medium">
                Sign up today and start your journey
              </p>
            </div>

            {/* SignUp Form */}
            <SignUpForm />

            {/* Divider - Smaller spacing */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-semibold">
                  Already on LinkedIn?
                </span>
              </div>
            </div>

            {/* Sign In Button - Smaller */}
            <Link
              to="/login"
              className="w-full flex justify-center items-center py-2 px-4 border-2 border-blue-600 rounded-xl 
                text-xs font-bold text-blue-600 bg-transparent hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 
                transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 
                transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="flex items-center space-x-1.5">
                <span>Sign in</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            {/* Promotional banner - Smaller */}
            <div className="mt-4 p-2.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-xs text-blue-800 text-center font-semibold flex items-center justify-center space-x-1.5">
                <span className="text-base">🚀</span>
                <span>Join today and get exclusive career insights</span>
              </p>
            </div>

            {/* Footer links - Smaller */}
            <div className="mt-4 text-center">
              <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                <a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:underline">Privacy</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:underline">Terms</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:underline">Help</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:underline">About</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;