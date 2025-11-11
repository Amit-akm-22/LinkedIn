// controllers/job.controller.js
import Job from '../models/job.model.js';

// Create a new job
export const createJob = async (req, res) => {
  try {
    const {
      companyName,
      position,
      role,
      description,
      requirements,
      responsibilities,
      salary,
      jobType,
      workMode,
      location,
      experienceLevel,
      skills,
      internshipDuration,
      applicationDeadline,
      benefits,
      status
    } = req.body;

    const jobData = {
      companyName,
      position,
      role,
      description,
      requirements: JSON.parse(requirements || '[]'),
      responsibilities: JSON.parse(responsibilities || '[]'),
      salary: JSON.parse(salary),
      jobType,
      workMode,
      location: JSON.parse(location || '{}'),
      experienceLevel,
      skills: JSON.parse(skills || '[]'),
      internshipDuration,
      applicationDeadline,
      benefits: JSON.parse(benefits || '[]'),
      status: status || 'Active',
      postedBy: req.user._id
    };

    if (req.file) {
      jobData.companyImage = `/uploads/companies/${req.file.filename}`;
    }

    const job = new Job(jobData);
    await job.save();

    await job.populate('postedBy', 'name email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job posting',
      error: error.message
    });
  }
};

// Get all jobs with filters
export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      workMode,
      experienceLevel,
      location,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { status: 'Active' };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (jobType) {
      query.jobType = jobType;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (location) {
      query.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
        { 'location.country': new RegExp(location, 'i') }
      ];
    }

    if (minSalary || maxSalary) {
      query['salary.min'] = {};
      if (minSalary) query['salary.min'].$gte = Number(minSalary);
      if (maxSalary) query['salary.max'] = { $lte: Number(maxSalary) };
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email profilePicture')
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get single job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email profilePicture headline');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updateData = { ...req.body };

    // Parse JSON fields if they exist
    if (updateData.requirements) updateData.requirements = JSON.parse(updateData.requirements);
    if (updateData.responsibilities) updateData.responsibilities = JSON.parse(updateData.responsibilities);
    if (updateData.salary) updateData.salary = JSON.parse(updateData.salary);
    if (updateData.location) updateData.location = JSON.parse(updateData.location);
    if (updateData.skills) updateData.skills = JSON.parse(updateData.skills);
    if (updateData.benefits) updateData.benefits = JSON.parse(updateData.benefits);

    if (req.file) {
      updateData.companyImage = `/uploads/companies/${req.file.filename}`;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email profilePicture');

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// Get all jobs posted by current user
export const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('applications');

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posted jobs',
      error: error.message
    });
  }
};