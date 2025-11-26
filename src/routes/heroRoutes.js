import express from "express";
import { upload, uploadHeroImage, getHeroImage } from "../controller/heroController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadHeroImage);
router.get("/", getHeroImage);

export default router;
