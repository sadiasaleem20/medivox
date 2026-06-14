import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String },
  times: [{ type: String }],
  withFood: { type: Boolean, default: false },
  duration: { type: String },
});

const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    imageUrl: { type: String },
    rawText: { type: String },
    medicines: [medicineSchema],
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("Prescription", prescriptionSchema);
