import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
} from "../controllers/appointmentController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/slots", protect, getAvailableSlots);
router.post("/", protect, authorizeRoles("user"), bookAppointment);
router.get("/my", protect, authorizeRoles("user"), getMyAppointments);
router.get("/doctor", protect, authorizeRoles("doctor"), getDoctorAppointments);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("doctor"),
  updateAppointmentStatus,
);
router.patch("/:id/cancel", protect, authorizeRoles("user"), cancelAppointment);

export default router;
