import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fee: { type: Number, required: true },
    consultancyPlace: { type: String, required: true },
    startTime: { type: String },
    endTime: { type: String },
    availableDays: [{ type: String }],
    about: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    licenseDocument: { type: String, default: "" },
    documents: [documentSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", doctorSchema);
