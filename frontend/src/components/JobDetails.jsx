// components/JobDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import ApplicationForm from './ApplicationForm';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      setJob(response.data.job);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Error loading job details');
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await axiosInstance.get('/applications/my');
      const applied = response.data.applications.some(
        app => app.job._id === id
      );
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const formatSalary = (salary) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLocation = (location) => {
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);
    return parts.join(', ') || 'Location not specified';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Job not found</h2>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start gap-6 mb-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {job.companyImage ? (
              <img 
                src={job.companyImage} 
                alt={job.companyName}
                className="w-24 h-24 rounded-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100?text=Company';
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {job.companyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Job Title and Company */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.position}</h1>
            <p className="text-xl text-gray-600 mb-4">{job.companyName}</p>
            
            {/* Quick Info Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                💼 {job.jobType}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                🏢 {job.workMode}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                📍 {getLocation(job.location)}
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                👤 {job.experienceLevel}
              </span>
            </div>

            {/* Salary */}
            <div className="text-xl font-bold text-green-600 mb-4">
              💰 {formatSalary(job.salary)}
            </div>

            {/* Apply Button */}
            {hasApplied ? (
              <button
                disabled
                className="px-8 py-3 bg-gray-400 text-white rounded-md cursor-not-allowed"
              >
                Already Applied
              </button>
            ) : (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Posted Info */}
        <div className="flex gap-6 text-sm text-gray-500 border-t pt-4">
          <span>🕒 Posted {formatDate(job.createdAt)}</span>
          <span>👁️ {job.views} views</span>
          {job.applicationDeadline && (
            <span>⏰ Deadline: {formatDate(job.applicationDeadline)}</span>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
        {/* Role */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Role</h2>
          <p className="text-gray-700 text-lg">{job.role}</p>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </section>

        {/* Internship Duration */}
        {job.jobType === 'Internship' && job.internshipDuration && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Duration</h2>
            <p className="text-gray-700">{job.internshipDuration}</p>
          </section>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Requirements</h2>
            <ul className="list-disc list-inside space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-gray-700">{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="text-gray-700">{resp}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Benefits</h2>
            <ul className="list-disc list-inside space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </section>
        )}

        {/* About the Company */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">About {job.companyName}</h2>
          <p className="text-gray-700">
            Posted by {job.postedBy?.name || 'Company Representative'}
          </p>
        </section>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <ApplicationForm
          jobId={job._id}
          jobTitle={job.position}
          companyName={job.companyName}
          onClose={() => setShowApplicationForm(false)}
          onSuccess={() => {
            setShowApplicationForm(false);
            setHasApplied(true);
            toast.success('Application submitted successfully!');
          }}
        />
      )}
    </div>
  );
};

export default JobDetails;