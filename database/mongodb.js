import mongoose from "mongoose";
import dns from "dns";
import { NODE_ENV, MONGODB_URI } from "../config/env.js";

if (NODE_ENV === "development") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env<development/production>.local",
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.log("Error connecting to database: ", error);
    process.exit(1);
  }
};

export default connectToDatabase;
