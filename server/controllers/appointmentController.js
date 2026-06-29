import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    if (!doctorId || !date || !time) {
      return res
        .status(400)
        .json({ message: "Doctor, date and time are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (doctor.status !== "approved") {
      return res.status(400).json({ message: "Doctor is not available" });
    }

    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
    });

    const populated = await appointment.populate([
      { path: "user", select: "-password" },
      { path: "doctor", populate: { path: "user", select: "-password" } },
    ]);

    res.status(201).json({ appointment: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "-password" },
      })
      .sort({ date: 1, time: 1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("user", "-password")
      .sort({ date: 1, time: 1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const doctor = await Doctor.findOne({ user: req.user._id });

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctor: doctor._id },
      { status, notes },
      { new: true },
    ).populate("user", "-password");

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "cancelled" },
      { new: true },
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const booked = await Appointment.find({
      doctor: doctorId,
      date,
      status: { $in: ["pending", "confirmed"] },
    }).select("time");

    const bookedTimes = booked.map((a) => a.time);

    const allSlots = [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
    ];

    const available = allSlots.filter((s) => !bookedTimes.includes(s));
    res.json({ slots: available, bookedTimes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
