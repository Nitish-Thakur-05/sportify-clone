import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function checkArtist(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "unauthorised",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "you dont have access to create music",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unauthorised " });
  }
}
