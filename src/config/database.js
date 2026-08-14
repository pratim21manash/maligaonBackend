import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const seedDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "ADMIN_EMAIL or ADMIN_PASSWORD is not set in environment variables.",
    );
    return;
  }

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    await Admin.create({
      email,
      password,
      name: "Super Admin",
    });
    console.log(`Default admin created: ${email}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultAdmin();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
