// components/MyPostedJobs.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const fetchPostedJobs = async () => {
    try {
      const response = await axiosInstance.get('/jobs/my/posted');
      setJobs(response.data.jobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
      toast.error('Error loading posted jobs');
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const response = await axiosInstance.get(`/applications/job/${jobId}`);
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error loading applications');
    }
  };

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    fetchApplications(job._id);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await axiosInstance.put(
        `/applications/${applicationId}/status`,
        { status: newStatus }
      );
      toast.success('Application status updated');
      fetchApplications(selectedJob._id);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating application status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      fetchPostedJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error deleting job');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Reviewed': 'bg-blue-100 text-blue-800',
      'Shortlisted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Accepted': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Posted Jobs</h1>
        <Link
          to="/jobs/post"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
        >
          + Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No jobs posted yet</h3>
          <p className="text-gray-600 mb-4">Start posting jobs to find great candidates</p>
          <Link
            to="/jobs/post"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                {job.companyImage ? (
                  <img 
                    src={job.companyImage} 
                    alt={job.companyName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {job.companyName.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{job.position}</h3>
                  <p className="text-gray-600">{job.companyName}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  💼 {job.jobType}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  🏢 {job.workMode}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>📍 {job.location?.city || 'Remote'}, {job.location?.country}</p>
                <p>🕒 Posted {formatDate(job.createdAt)}</p>
                <p>👁️ {job.views} views</p>
                <p className="font-semibold text-blue-600">
                  📋 {job.applications?.length || 0} Applications
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleViewApplications(job)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                >
                  View Applications
                </button>
                <Link
                  to={`/jobs/${job._id}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
                <p className="text-gray-600">
                  {selectedJob.position} - {applications.length} applicants
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setApplications([]);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {applications.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {app.applicant.profilePicture ? (
                            <img 
                              src={app.applicant.profilePicture} 
                              alt={app.applicant.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                              {app.applicant.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900">{app.applicant.name}</h4>
                              <p className="text-sm text-gray-600">{app.applicant.email}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </div>

                          <p className="text-sm text-gray-500 mb-3">
                            Applied {formatDate(app.createdAt)}
                          </p>

                          {app.coverLetter && (
                            <div className="mb-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                              <strong>Cover Letter:</strong>
                              <p className="mt-1">{app.coverLetter}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <a
                              href={app.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                            >
                              View Resume
                            </a>
                            
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewed">Reviewed</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Accepted">Accepted</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPostedJobs;