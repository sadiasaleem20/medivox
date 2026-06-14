import User from "../models/User.js";
import Prescription from "../models/Prescription.js";

export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, medicalHistory } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, city, medicalHistory },
      { new: true },
    ).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const savePrescription = async (req, res) => {
  try {
    const { medicines, rawText, notes, doctorId, imageUrl } = req.body;
    const prescription = await Prescription.create({
      user: req.user._id,
      doctor: doctorId,
      imageUrl,
      rawText,
      medicines,
      notes,
    });
    res.status(201).json({ prescription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id })
      .populate("doctor")
      .sort({ createdAt: -1 });
    res.json({ prescriptions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
