import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = new User({
    email: "admin@test.com",
    password: hashedPassword
  });

  await user.save();

  console.log("Admin created !");
  process.exit();
};

createAdmin();