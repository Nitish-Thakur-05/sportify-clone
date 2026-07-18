import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";

dotenv.config();

try {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log("DB connected and server is running...");
  });
} catch (error) {
  console.log("DB not connected or any server issue", error);
  process.exit(1);
}
