import musicModel from "../models/music.model.js";
import dotenv from "dotenv";
import UploadFile from "../services/storage.service.js";
import { deleteFile } from "../services/storage.service.js";

dotenv.config();

export async function musicController(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(500).json({
      message: "unauthorise",
    });
  }

  // if (!req.body || !req.body.music || !req.body.title) {
  //   return res.status(500).json({
  //     message: "all fields are required",
  //   });
  // }

  let uploadedMusic;
  try {
    // imagekit ( converting song to url )
    uploadedMusic = await UploadFile(req.file.buffer, req.file.originalname);

    const music = await musicModel.create({
      music: uploadedMusic.url,
      title: req.body.title,
      artist: req.user.id,
      fileId: uploadedMusic.fileId,
    });

    res.status(201).json({
      message: "music added successfully",
      music,
    });
  } catch (error) {
    console.log(error);

    if (uploadedMusic) {
      await deleteFile(uploadedMusic.fileId);
    }

    res.status(500).send({
      mesage: "token not valid",
    });
  }
}

export async function allMusic(req, res) {
  try {
    const musics = await musicModel.find().populate("artist", "username email");

    res.status(200).json({
      musics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "unable to fetch music now",
    });
  }
}

export async function deleteMusic(req, res) {
  try {
    const music = await musicModel.findOne({ _id: req.params.id });

    if (req.user.id != music.artist) {
      return res.status(403).json({
        message: "permission denied",
      });
    }

    await deleteFile(music.fileId);
    await musicModel.findByIdAndDelete({ _id: req.params.id });

    res.json({
      message: "music deleted successfully",
      music,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "cannot delete now",
    });
  }
}
