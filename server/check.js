import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to:", mongoose.connection.name);

  const users = await mongoose.connection.db
    .collection("users")
    .find({})
    .toArray();
  console.log("Total users:", users.length);
  users.forEach((u) => console.log("-", u.email, "|", u.role));

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
