import express from "express";
import {
  musicController,
  allMusic,
  deleteMusic,
} from "../controllers/music.controller.js";
import multer, { memoryStorage } from "multer";
import checkArtist from "../middlewares/artistAuth.middleware.js";
import checkAuth from "../middlewares/auth.middleware.js";

const upload = multer({ storage: memoryStorage() });

const router = express.Router();

router.post("/create", checkArtist, upload.single("music"), musicController);
router.get("/", checkAuth, allMusic);
router.delete("/delete/:id", checkArtist, deleteMusic);

export default router;
