import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectInst = await mongoose.connect(
      `${process.env.MONGO_DB}/${DB_NAME}`
    );
    console.log(
      `\n MongDB connected :: DB Host:${connectInst.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection Failed :: ", error);
    process.exit(1);
  }
};

export { connectDB };
