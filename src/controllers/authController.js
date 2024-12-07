import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";

// Register route
export const register = async (req, res, next) => {
  try {
    const { password, username } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashPassword,
      isMfaActive: false,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "user registered successfully", data: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login route
export const login = async (req, res, next) => {
  console.log(`The autheticated use is: ${req.user}`);
  res.status(200).json({
    messsage: "user login successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};

// Authstatus route
export const authStatus = async (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    res.status(200).json({
      messsage: "User is authenticated",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: `user unauthorized` });
  }
  console.log(req.user);
};

// logout route
export const logout = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: `User unauthorized` });
  }

  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: `Error during logout`, error: err.message });
    }
    return res.status(200).json({ message: `User logout successful` });
  });
};

// 2FA setup
export const setup2FA = async (req, res, next) => {
  try {
    console.log(`The req.user is ${req.user}`);
    const user = req.user;

    // Generate a secret using speakeasy
    const secret = speakeasy.generateSecret();
    console.log("The secret object is: ", secret);

    // Save the secret to the user's record
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();

    // Use the provided otpauth_url property from speakeasy
    // Construct the otpauth_url with secret.base32
    const label = encodeURIComponent(`${user.username}`);
    const issuer = encodeURIComponent("www.mukeshvijayakumar.com");
    const otpauthUrl = `otpauth://totp/${label}?secret=${secret.base32}&issuer=${issuer}`;

    console.log("Constructed otpauth URL: ", otpauthUrl);

    // Generate a QR code from the otpauth_url
    const qrImageUrl = await qrcode.toDataURL(otpauthUrl);

    // Send the secret and QR code back to the client
    res.status(200).json({ secret: secret.base32, qrcode: qrImageUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2FA verify
export const verify2FA = async (req, res, next) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });
  if (verified) {
    const JWToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );

    res
      .status(200)
      .json({ message: "2FA verification successful", token: JWToken });
  } else {
    res.status(400).json({ message: "Invalid 2FA token" });
  }
};

// 2FA reset
export const reset2FA = async (req, res, next) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successful" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error resetting 2FA", message: error.message });
  }
};
