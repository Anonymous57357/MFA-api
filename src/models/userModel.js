import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },  
    isMfaActive: {
      type: Boolean,
      required: false,
    },
    twoFactorSecret: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User; 
