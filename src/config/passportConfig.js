import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Await the result of findOne
      const existUser = await User.findOne({ username });

      // Check if the user exists
      if (!existUser) {
        return done(null, false, { message: "User not found" });
      }

      // Compare the provided password with the stored hash
      const comparePassword = await bcrypt.compare(
        password,
        existUser.password
      );

      if (!comparePassword) {
        return done(null, false, { message: "Incorrect password" });
      }

      // If everything is fine, return the user
      return done(null, existUser);
    } catch (error) {
      return done(error);
    }
  })
);

// this one its like auth middleware attaching a user to req.user

passport.serializeUser((user, done) => {
  console.log("Inside serializeUser", user._id); // Debugging log
  done(null, user._id); // Store user ID in the session
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside deserializer");
  try {
    const user = await User.findById(id);
    console.log(`User found in deserializerUser ${user}`);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
