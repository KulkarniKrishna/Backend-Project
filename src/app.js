import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// to standardize and allow the URL to hit the apis we build
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// convert all the incoming body formats to JSON with size limit of 16KB
app.use(express.json({ limit: "16kb" }));

// to be able to read a encoded url
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// route to folder that contains PDFs/images/vids/icons/etc
app.use(express.static("public"));

// to be able to perform CURD operations on cookies stored in browser
app.use(cookieParser());

// routes imports
import userRouter from "./routes/user.routes.js";

//routes declarations
app.use("/api/v1/users", userRouter);

export { app };
