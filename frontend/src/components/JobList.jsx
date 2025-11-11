// components/JobList.jsx
import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import JobCard from "./JobCard";
import toast from "react-hot-toast";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    jobType: "",
    workMode: "",
    experienceLevel: "",
    location: "",
    minSalary: "",
    maxSalary: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      // Remove empty filters
      Object.keys(filters).forEach((key) => {
        if (!filters[key]) params.delete(key);
      });

      const response = await axiosInstance.get(`/jobs?${params.toString()}`);

      setJobs(response.data.jobs);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      }));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      jobType: "",
      workMode: "",
      experienceLevel: "",
      location: "",
      minSalary: "",
      maxSalary: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="w-full px-6 py-8">
      {/* ===== Header ===== */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-2 tracking-tight">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600 text-lg">
          Discover opportunities that match your skills and interests
        </p>
      </div>

      {/* ===== Search & Filters ===== */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 mb-10 hover:shadow-lg transition-all duration-300">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="search"
              placeholder="Search by job title, role, or company..."
              value={filters.search}
              onChange={handleFilterChange}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Temporary">Temporary</option>
          </select>

          <select
            name="workMode"
            value={filters.workMode}
            onChange={handleFilterChange}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={handleFilterChange}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Lead">Lead</option>
            <option value="Executive">Executive</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="minSalary"
            placeholder="Min Salary"
            value={filters.minSalary}
            onChange={handleFilterChange}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="maxSalary"
            placeholder="Max Salary"
            value={filters.maxSalary}
            onChange={handleFilterChange}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={clearFilters}
          className="px-6 py-2 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition"
        >
          Clear All Filters
        </button>
      </div>

      {/* ===== Results Info ===== */}
      <div className="mb-6">
        <p className="text-gray-700 text-lg font-medium">
          {pagination.total} jobs found
        </p>
      </div>

      {/* ===== Job Cards ===== */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-gray-100 rounded-2xl p-12 text-center shadow-inner">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* ===== Pagination ===== */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-gray-700 font-semibold">
            Page {pagination.page} of {pagination.pages}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;
