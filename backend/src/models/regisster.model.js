import mongoose from "mongoose";

const registerSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is needed"],
    minlength: [3, "username must be at least 3 characters long"],
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "artist"],
    default: "user",
  },
});

const registerModel = mongoose.model("user", registerSchema);

export default registerModel;
