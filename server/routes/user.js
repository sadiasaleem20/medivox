import express from "express";
import {
  getProfile,
  updateProfile,
  savePrescription,
  getMyPrescriptions,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("user"), getProfile);
router.put("/profile", protect, authorizeRoles("user"), updateProfile);
router.post("/prescription", protect, authorizeRoles("user"), savePrescription);
router.get(
  "/prescriptions",
  protect,
  authorizeRoles("user"),
  getMyPrescriptions,
);

export default router;
