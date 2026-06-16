import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to:", mongoose.connection.name);

  const hashed = await bcrypt.hash("Admin@12345", 12);

  const result = await mongoose.connection.db.collection("users").updateOne(
    { email: "admin@medivox.com" },
    {
      $set: {
        name: "Medivox Admin",
        email: "admin@medivox.com",
        password: hashed,
        role: "admin",
        phone: "+92 300 0000000",
        city: "Lahore",
        isActive: true,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  console.log("Result:", result);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
