// components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const formatDate = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getLocation = (location) => {
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);
    return parts.join(', ') || 'Location not specified';
  };

  return (
    <Link 
      to={`/jobs/${job._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {job.companyImage ? (
              <img 
                src={job.companyImage} 
                alt={job.companyName}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80?text=Company';
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {job.companyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {job.position}
            </h3>
            <p className="text-gray-600 font-medium truncate">{job.companyName}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-3">
        {/* Meta Information */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <span>💼</span>
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span>🏢</span>
            {job.workMode}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <span>📍</span>
            {job.location.city || 'Remote'}
          </span>
        </div>

        {/* Role */}
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Role: </span>
          <span className="text-gray-600">{job.role}</span>
        </div>

        {/* Experience */}
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Experience: </span>
          <span className="text-gray-600">{job.experienceLevel}</span>
        </div>

        {/* Location Full */}
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Location: </span>
          <span className="text-gray-600">{getLocation(job.location)}</span>
        </div>

        {/* Internship Duration */}
        {job.jobType === 'Internship' && job.internshipDuration && (
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Duration: </span>
            <span className="text-gray-600">{job.internshipDuration}</span>
          </div>
        )}

        {/* Salary */}
        <div className="text-sm font-semibold text-green-600 pt-2">
          💰 {formatSalary(job.salary)}
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span>🕒</span>
          {formatDate(job.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <span>👁️</span>
          {job.views} views
        </span>
      </div>
    </Link>
  );
};

export default JobCard;