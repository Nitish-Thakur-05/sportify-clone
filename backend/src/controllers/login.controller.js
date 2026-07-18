import jwt from "jsonwebtoken";
import registerModel from "../models/regisster.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export async function loginUser(req, res) {
  if ((!req.body.email && !req.body.username) || !req.body.password) {
    return res.status(500).json({
      message: "all fields are required",
    });
  }

  try {
    const user = await registerModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (!user) {
      return res.status(500).json({
        message: "invalid username or password ",
      });
    }

    const isMatchPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isMatchPassword) {
      return res.status(500).json({
        message: "invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token);

    res.status(200).json({
      message: "login successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "unable to login now",
      reason: error.message,
    });
  }
}

export async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "logout successful",
  });
}
