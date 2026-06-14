import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      city,
      specialization,
      experience,
      fee,
      consultancyPlace,
      startTime,
      endTime,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const userRole = role === "doctor" ? "doctor" : "user";
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone,
      city,
    });

    if (userRole === "doctor") {
      await Doctor.create({
        user: user._id,
        specialization: specialization || "General Physician",
        experience: experience || 0,
        fee: fee || 0,
        consultancyPlace: consultancyPlace || "",
        startTime: startTime || "",
        endTime: endTime || "",
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
