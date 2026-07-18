import mongoose from "mongoose";

const musicSchema = mongoose.Schema({
  music: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
});

const musicModel = mongoose.model("music", musicSchema);

export default musicModel;
