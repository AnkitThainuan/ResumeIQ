import express from "express";
import multer from "multer";
import { uploadResume, getResumes } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/history", protect, getResumes);

export default router;
