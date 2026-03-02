import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // agar tidak ikut saat find()
    },

  },
  {
    timestamps: true, // createdAt & updatedAt otomatis
  }
);

const User = mongoose.model("User", userSchema);

export default User;