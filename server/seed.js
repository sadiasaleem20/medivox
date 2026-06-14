import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/medivox");
  console.log("Connected to MongoDB");

  const hashed = await bcrypt.hash("Admin@12345", 12);

  const result = await mongoose.connection.db.collection("users").insertOne({
    name: "Medivox Admin",
    email: "admin@medivox.com",
    password: hashed,
    role: "admin",
    phone: "+92 300 0000000",
    city: "Lahore",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Admin created:", result.insertedId);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
