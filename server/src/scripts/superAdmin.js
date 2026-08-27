// src/scripts/createSuperAdmin.js
import "dotenv/config";
import mongoose from "mongoose";
import User from "../model/User.js";

async function superAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "superAdmin" });
    if (existingAdmin) {
      console.log("A super admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const admin = new User({
      name: "JOZY Tech Admin",
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: "superAdmin",
    });

    await admin.save();

    console.log("Super admin created successfully:");
    console.log("Email:", admin.email);

    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error.message);
    process.exit(1);
  }
}

superAdmin();