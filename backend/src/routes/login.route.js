import express from "express";
import {loginUser, logoutUser} from "../controllers/login.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
