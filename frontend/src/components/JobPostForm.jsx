// components/JobPostForm.jsx
import React, { useState } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const JobPostForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    role: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    jobType: 'Full-time',
    workMode: 'On-site',
    city: '',
    state: '',
    country: '',
    experienceLevel: 'Mid Level',
    skills: [''],
    internshipDuration: '',
    applicationDeadline: '',
    benefits: [''],
    status: 'Active'
  });

  const [companyImage, setCompanyImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key].filter(item => item.trim())));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add salary as JSON object
      formDataToSend.set('salary', JSON.stringify({
        min: Number(formData.salaryMin),
        max: Number(formData.salaryMax),
        currency: formData.currency
      }));

      // Add location as JSON object
      formDataToSend.set('location', JSON.stringify({
        city: formData.city,
        state: formData.state,
        country: formData.country
      }));

      // Add company image
      if (companyImage) {
        formDataToSend.append('companyImage', companyImage);
      }

      const response = await axiosInstance.post(
        '/jobs',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Job posted successfully!');
      if (onSuccess) onSuccess(response.data.job);
      
      // Reset form
      setFormData({
        companyName: '',
        position: '',
        role: '',
        description: '',
        requirements: [''],
        responsibilities: [''],
        salaryMin: '',
        salaryMax: '',
        currency: 'USD',
        jobType: 'Full-time',
        workMode: 'On-site',
        city: '',
        state: '',
        country: '',
        experienceLevel: 'Mid Level',
        skills: [''],
        internshipDuration: '',
        applicationDeadline: '',
        benefits: [''],
        status: 'Active'
      });
      setCompanyImage(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error posting job');
      toast.error(err.response?.data?.message || 'Error posting job');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Post a New Job</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
            Company Information
          </h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="mt-4 max-w-[200px] max-h-[200px] rounded-lg border-2 border-gray-300"
              />
            )}
          </div>
        </section>

        {/* Job Details */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
            Job Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Role *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Backend Developer"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Job Type *</label>
              <select 
                name="jobType" 
                value={formData.jobType} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Work Mode *</label>
              <select 
                name="workMode" 
                value={formData.workMode} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Experience Level *</label>
              <select 
                name="experienceLevel" 
                value={formData.experienceLevel} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead">Lead</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>

          {formData.jobType === 'Internship' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Internship Duration</label>
              <input
                type="text"
                name="internshipDuration"
                value={formData.internshipDuration}
                onChange={handleChange}
                placeholder="e.g., 3 months, 6 months"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </section>

        {/* Salary */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
            Salary Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Minimum Salary *</label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Maximum Salary *</label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Currency</label>
              <select 
                name="currency" 
                value={formData.currency} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
            Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
            Requirements
          </h3>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                placeholder="Enter a requirement"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'requirements')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('requirements')}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            + Add Requirement
          </button>
        </section>

        {/* Responsibilities */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
            Responsibilities
          </h3>
          {formData.responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleArrayChange(index, e.target.value, 'responsibilities')}
                placeholder="Enter a responsibility"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'responsibilities')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('responsibilities')}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            + Add Responsibility
          </button>
        </section>

        {/* Skills */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
            Required Skills
          </h3>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange(index, e.target.value, 'skills')}
                placeholder="Enter a skill"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'skills')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('skills')}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            + Add Skill
          </button>
        </section>

        {/* Benefits */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
            Benefits
          </h3>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayChange(index, e.target.value, 'benefits')}
                placeholder="Enter a benefit"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'benefits')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('benefits')}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            + Add Benefit
          </button>
        </section>

        {/* Application Deadline */}
        <section className="border border-gray-200 rounded-lg p-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Application Deadline</label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        <button 
          type="submit" 
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default JobPostForm;