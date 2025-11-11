// routes/job.route.js
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyPostedJobs
} from '../controllers/job.controller.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/', protectRoute, upload.single('companyImage'), createJob);
router.put('/:id', protectRoute, upload.single('companyImage'), updateJob);
router.delete('/:id', protectRoute, deleteJob);
router.get('/my/posted', protectRoute, getMyPostedJobs);

export default router;