import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "ResumeIQ API running ✅" }));
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

export default app;
