import express from "express";
import {
  getDoctors,
  getDoctorById,
  getMyProfile,
  updateMyProfile,
  uploadDocument,
  deleteDocument,
} from "../controllers/doctorController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getDoctors);
router.get("/me", protect, authorizeRoles("doctor"), getMyProfile);
router.put("/me", protect, authorizeRoles("doctor"), updateMyProfile);
router.post("/me/documents", protect, authorizeRoles("doctor"), uploadDocument);
router.delete(
  "/me/documents/:docId",
  protect,
  authorizeRoles("doctor"),
  deleteDocument,
);
router.get("/:id", getDoctorById);

export default router;
