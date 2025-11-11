// routes/application.route.js
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  createApplication,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication
} from '../controllers/application.controller.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// All routes are protected
router.post('/', protectRoute, upload.single('resume'), createApplication);
router.get('/my', protectRoute, getMyApplications);
router.get('/job/:jobId', protectRoute, getJobApplications);
router.put('/:id/status', protectRoute, updateApplicationStatus);
router.delete('/:id', protectRoute, withdrawApplication);

export default router;