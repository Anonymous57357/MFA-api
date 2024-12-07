import express, { urlencoded, json } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportConfig.js";

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ limit: "100mb", extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 }, // 1 hour
  })
);

// Initialize Passport and session
app.use(passport.session());  
app.use(passport.initialize());

// routes
app.use("/api/auth", authRoutes);
// server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`server is listening on PORT: ${PORT}`);
});
