import Doctor from "../models/Doctor.js";

export const getDoctors = async (req, res) => {
  try {
    const { city, specialization, search } = req.query;
    let doctors = await Doctor.find({ status: "approved" }).populate(
      "user",
      "name email phone city avatar",
    );

    if (city) doctors = doctors.filter((d) => d.user?.city === city);
    if (specialization)
      doctors = doctors.filter((d) => d.specialization === specialization);
    if (search)
      doctors = doctors.filter(
        (d) =>
          d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          d.specialization?.toLowerCase().includes(search.toLowerCase()),
      );

    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "-password",
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate(
      "user",
      "-password",
    );
    if (!doctor)
      return res.status(404).json({ message: "Doctor profile not found" });
    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const {
      specialization,
      experience,
      fee,
      consultancyPlace,
      startTime,
      endTime,
      availableDays,
      about,
      profilePicture,
      licenseDocument,
    } = req.body;

    const updateFields = {};
    if (specialization !== undefined)
      updateFields.specialization = specialization;
    if (experience !== undefined) updateFields.experience = experience;
    if (fee !== undefined) updateFields.fee = fee;
    if (consultancyPlace !== undefined)
      updateFields.consultancyPlace = consultancyPlace;
    if (startTime !== undefined) updateFields.startTime = startTime;
    if (endTime !== undefined) updateFields.endTime = endTime;
    if (availableDays !== undefined) updateFields.availableDays = availableDays;
    if (about !== undefined) updateFields.about = about;
    if (profilePicture !== undefined)
      updateFields.profilePicture = profilePicture;
    if (licenseDocument !== undefined)
      updateFields.licenseDocument = licenseDocument;

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateFields },
      { new: true },
    ).populate("user", "-password");

    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { name, size, url } = req.body;
    if (!name || !url)
      return res.status(400).json({ message: "Name and url required" });

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $push: { documents: { name, size, url, uploadedAt: new Date() } } },
      { new: true },
    ).populate("user", "-password");

    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { documents: { _id: req.params.docId } } },
      { new: true },
    ).populate("user", "-password");

    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
