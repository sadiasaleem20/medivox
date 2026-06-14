import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "pending" }).populate(
      "user",
      "-password",
    );
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const doctors = await Doctor.find(filter).populate("user", "-password");
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDoctorStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason: rejectionReason || "" },
      { new: true },
    ).populate("user", "-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalDoctors, pendingDoctors, approvedDoctors] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "doctor" }),
        Doctor.countDocuments({ status: "pending" }),
        Doctor.countDocuments({ status: "approved" }),
      ]);
    res.json({ totalUsers, totalDoctors, pendingDoctors, approvedDoctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
