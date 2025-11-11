// pages/JobsPage.jsx
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Plus, FileText, List } from "lucide-react";
import JobList from "../components/JobList";

const JobsPage = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ===== Left Sidebar ===== */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-4 mt-2 sticky top-[64px] h-[calc(100vh-64px)]">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 px-2">Job Menu</h2>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/jobs"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/jobs"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Briefcase size={18} />
            <span>Jobs</span>
          </Link>

          <Link
            to="/jobs/post"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/jobs/post"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Plus size={18} />
            <span>Post Job</span>
          </Link>

          <Link
            to="/my-applications"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/my-applications"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileText size={18} />
            <span>My Applications</span>
          </Link>

          <Link
            to="/my-posted-jobs"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/my-posted-jobs"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <List size={18} />
            <span>My Posted Jobs</span>
          </Link>
        </nav>
      </aside>

      {/* ===== Main Job Content ===== */}
      <main className="flex-1 p-6">
        <JobList />
      </main>
    </div>
  );
};

export default JobsPage;
