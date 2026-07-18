import registerModel from "../models/regisster.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function registerController(req, res) {
  if (
    !req.body ||
    !req.body.email ||
    !req.body.username ||
    !req.body.password
  ) {
    return res.status(500).send({
      message: "all data are needed",
    });
  }

  // checking for user existance
  const isUserExists = await registerModel.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  if (isUserExists) {
    return res.status(409).json({
      message: "user already exists",
    });
  }

  try {
    // hashing passowrd
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // creating account in DB
    const data = await registerModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    // creating token using JWT
    const token = jwt.sign(
      {
        id: data._id,
        role: data.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // setting cookie in browser
    res.cookie("token", token);

    res.status(201).send({
      message: "user added",
      data,
    });
  } catch (error) {
    res.status(500).send({
      message: "user not added",
      reason: error.message,
    });
  }
}
