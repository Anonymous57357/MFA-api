import express from "express";
import passport from "passport";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  login,
  logout,
  register,
  authStatus,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js";

const router = express.Router();

// routes
// Registration route
router.post("/register", register);

// Login route
router.post("/login", passport.authenticate("local"), login);

// Auth status route
router.get("/auth-status", authStatus);

// Logout route
router.post("/logout", logout);

// 2FA setup route
router.post("/2FA/setup", authMiddleware, setup2FA);

// verify route
router.post("/2FA/verify", authMiddleware, verify2FA);

// Reset route
router.post("/2FA/reset", authMiddleware, reset2FA);

export default router;
