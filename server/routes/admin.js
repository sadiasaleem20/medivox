import express from "express";
import {
  getPendingDoctors,
  getAllDoctors,
  updateDoctorStatus,
  getAllUsers,
  getStats,
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/stats", getStats);
router.get("/doctors", getAllDoctors);
router.get("/doctors/pending", getPendingDoctors);
router.patch("/doctors/:id", updateDoctorStatus);
router.get("/users", getAllUsers);

export default router;
