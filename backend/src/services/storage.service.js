import imageKit from "@imagekit/nodejs";
import dotenv from "dotenv";

dotenv.config();

const client = new imageKit({
  privateKey: process.env.IMAGEKIT_KEY,
});

export default async function UploadFile(buffer, filename) {
  const response = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: filename,
    folder: "sportify",
  });
  return response;
}

export async function deleteFile(fileId) {
  return await client.files.delete(fileId);
}
