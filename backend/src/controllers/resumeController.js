import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Resume from "../models/resume.js";
import { analyzeResume } from "../utils/aiService.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please select a PDF file." });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    let parsed;
    try {
      parsed = await pdfParse(dataBuffer);
    } catch (pdfErr) {
      return res.status(400).json({ error: "Could not read PDF. Please upload a valid PDF file." });
    }

    if (!parsed.text || parsed.text.trim().length < 50) {
      return res.status(400).json({ error: "PDF appears to be empty or image-only. Please upload a text-based PDF." });
    }

    const analysis = await analyzeResume(parsed.text);

    const resume = await Resume.create({
      user: req.user,
      filePath,
      extractedText: parsed.text,
      analysis,
    });

    res.json({ _id: resume._id, analysis, createdAt: resume.createdAt });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "An error occurred while analyzing your resume. Please try again." });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user }).sort({ createdAt: -1 }).limit(10);
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume history." });
  }
};
