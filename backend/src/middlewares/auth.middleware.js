import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function checkAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "unauthorised",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unauthorised " });
  }
}
